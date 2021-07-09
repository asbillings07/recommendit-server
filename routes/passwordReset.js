require('dotenv').config()
const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const messages = require('../services/emailMessages')
const { sendEmail } = require('../services/emailSend')
const emailTemplate = require('../services/emailTemplates')
const { asyncErrorHandler, validateEmail } = require('../services/middleware')
const { findUserByEmail, findUserByToken, updateUser, createSaltHash, addUserToken, findTokenByUser, findUserById } = require('../services/mongoFunctions')
const { saltRounds } = require('../config')

//POST /api/forgotpassword - status: 200 - finds user by email if the exist creates password reset token and sends customer reset password email.
router.post(
  '/forgotpassword',
  validateEmail,
  asyncErrorHandler(async (req, res) => {
    const { email } = req.body
    const user = await findUserByEmail(email)
    if (user) {
      const passwordToken = crypto.randomBytes(20).toString('hex')
      const hashedPasswordToken = await createSaltHash(passwordToken, Number(saltRounds))
      console.log(hashedPasswordToken)
      const { userId, token } = await addUserToken(user.id, hashedPasswordToken)
      sendEmail(emailTemplate.passwordReset(email, token, userId), messages.passwordReset)

      res.status(200).json({
        success: true
      })

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
    const { id, token } = req.query
    console.log(token)
    console.log(id)
    const passwordReset = await findTokenByUser(id)
    if (!passwordReset) throw new Error("Invalid or expired password reset token")

    const isValidToken = bcrypt.compare(token, passwordReset.token)
    if (!isValidToken) throw new Error("Invalid or expired password reset token")
    const user = await findUserById(id)

    res.status(200).json({
      email: user.email,
      message: 'successful'
    })
  })
)

//PUT /api/updatepassword - status: 200 - finds user by email, hashes password, inserts it into DB, resets token & expiration to null

router.put(
  '/updatepassword',
  asyncErrorHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await findUserByEmail(email)
    if (user) {
      const hashedPassword = await createSaltHash(password, Number(saltRounds))
      const newPassword = await updateUser(user.id, {
        password: hashedPassword
      })

      if (!newPassword) throw new Error('something went wrong!')

      res.status(200).json({ message: 'password updated successfully!' })
    } else {
      res.status(400).json({ message: 'No user exists in our database to update' })
    }
  })
)

module.exports = router
