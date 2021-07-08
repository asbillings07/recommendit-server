require('dotenv').config()
const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const messages = require('../services/emailMessages')
const { sendEmail } = require('../services/emailSend')
const emailTemplate = require('../services/emailTemplates')
const { asyncErrorHandler, validateEmail } = require('../services/middleware')
const { findUserByEmail, findUserByToken, updateUser } = require('../services/mongoFunctions')
const saltRounds = 12

//POST /api/forgotpassword - status: 200 - finds user by email if the exist creates password reset token and sends customer reset password email.
router.post(
  '/forgotpassword',
  validateEmail,
  asyncErrorHandler(async (req, res) => {
    const { email } = req.body
    const user = await findUserByEmail(email)
    if (user) {
      const token = crypto.randomBytes(20).toString('hex')
      console.log(token)
      const updatedUser = await updateUser(user.id, {
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 36000000
      })
      // email template with reset link and message

      if (updatedUser.resetPasswordToken === token) {
        sendEmail(emailTemplate.passwordReset(email, token), messages.passwordReset)

        res.status(200).json({
          success: true
        })
      }

    } else {
      console.log('email not in DB')
      res.status(400).json({
        message: 'check your information and try again'
      })
    }
  })
)

//GET /api/reset - status: 200 - finds user by password reset token, if the token exists on the query param user can proceed to reset their password.
router.get(
  '/reset',
  asyncErrorHandler(async (req, res) => {
    const token = req.query.token
    console.log(token)
    const user = await findUserByToken(token)
    // need to check if the resetPasswordExpires has actually expired...
    console.log(user)
    if (user && user.resetPasswordExpires > Date.now()) {
      res.status(200).json({
        email: user.email,
        message: 'successful'
      })
    } else {
      res.status(400).json({ error: 'password reset link is invalid or expired' })
    }
  })
)

//PUT /api/updatepassword - status: 200 - finds user by email, hashes password, inserts it into DB, resets token & expiration to null

router.put(
  '/updatepassword',
  asyncErrorHandler(async (req, res, _next) => {
    const { email, password } = req.body
    const user = await findUserByEmail(email)
    if (user) {
      bcrypt
        .hash(password, saltRounds)
        .then((hashedPassword) => {
          updateUser(user.id, {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null
          })
        })
        .then(() => {
          res.status(200).json({ message: 'password updated successfully!' })
        })
    } else {
      res.status(400).json({ message: 'No user exists in our database to update' })
    }
  })
)

module.exports = router
