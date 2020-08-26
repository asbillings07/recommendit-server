require('dotenv').config()
const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const messages = require('../services/emailMessages')
const { sendEmail } = require('../services/emailSend')
const emailTemplate = require('../services/emailTemplates')
const asyncHandler = require('../services/asyncErrorHanlder')
const { validateEmail } = require('../services/validationChain')
const { findUserByEmail, findUserByToken } = require('../services/userFunctions')
const saltRounds = 12

//POST /api/forgotpassword - status: 200 - finds user by email if the exist creates password reset token and sends customer reset password email.
router.post(
  '/forgotpassword',
  validateEmail,
  asyncHandler(async (req, res, next) => {
    const { email } = req.body
    const user = await findUserByEmail(email)
    if (user) {
      const token = crypto.randomBytes(20).toString('hex')
      console.log(token)
      user.update({
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 36000000
      })
      // email template with reset link and message

      sendEmail(emailTemplate.passwordReset(email, token), messages.passwordReset)

      res.status(200).json({
        success: true
      })
    } else {
      console.log('email not in DB')
      res.status(400).json({
        message: 'Email not in Database'
      })
    }
  })
)

//GET /api/reset - status: 200 - finds user by password reset token, if the token exists on the query param user can proceed to reset their password.
router.get(
  '/reset',
  asyncHandler(async (req, res, _next) => {
    const token = req.query.resetPasswordToken
    console.log(token)
    const user = await findUserByToken(token)
    console.log(user)
    if (user) {
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
  asyncHandler(async (req, res, _next) => {
    const { email, password } = req.body
    const user = await findUserByEmail(email)
    if (user) {
      bcrypt
        .hash(password, saltRounds)
        .then((hashedPassword) => {
          user.update({
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
