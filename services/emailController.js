const { findUserByEmail, findUserById } = require('./userFunctions')
const { sendEmail } = require('./emailSend')
const messages = require('./emailMessages')
const template = require('./emailTemplates')
const asyncHandler = require('./asyncErrorHanlder')

exports.collectEmail = asyncHandler(async (req, res, next) => {
  // console.log(req.signedCookies)
  const { email } = req.body

  console.log(email)
  const user = await findUserByEmail(email)

  if (user && !user.confirmed) {
    sendEmail(template.confirm(user.email), messages.confirm)
    setTimeout(() => {
      res.status(200).json('Conformation Email in your inbox')
    }, 2000)
  } else {
    res.status(200).json({ message: messages.alreadyConfirmed })
  }
})

exports.confirmEmail = asyncHandler(async (req, res) => {
  console.log(req)
  const { id } = req.user

  const user = await findUserById(id)
  if (!user.confirmed) {
    user
      .update({
        confirmed: true
      })
      .then(() => res.json({ message: messages.confirmed }))
      .catch((err) => console.log(err))
  } else {
    res.json({ message: messages.alreadyConfirmed })
  }
})
