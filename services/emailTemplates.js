require('dotenv').config()
const env = process.env.NODE_ENV || 'development'
const { clientOrigin } = require('../config')[env]

module.exports = {
  confirm: (email) => ({
    from: 'recommendItBot@gmail.com',
    to: `${email}`,
    subject: 'Confirm Your Email',
    html: `
        <h1> Welcome to RecommendIt! </h1>
        <h3>Confirm your email by clicking the link below.</h3>
        <a href='${clientOrigin}/confirm'>
          Confirm Email
        </a>
        <p>We will never send you spam, or misuse your information</p>
        <p>We hope you enjoy using the App, if you think of anything that could make your experience better, please let us know! (you can reply to this email)</p>
      `
  }),

  passwordReset: (email, token, userId) => ({
    from: 'recommendItBot@gmail.com',
    to: `${email}`,
    subject: 'Link to Reset Password',
    html: ` 
    <p>
    You're receiving this e-mail because you requested a password reset for your RecommendIt account.

    Please click on the link below to choose a new password.
    </p>
    <a href='${clientOrigin}/reset?token=${token}&id=${userId}'>Reset Password</a>

    <p>If you did not request to reset your password, please disregard this email and your password will not be changed.
    </p>
   `
  })
}
