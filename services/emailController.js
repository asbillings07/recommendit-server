const { findUserByEmail, findUserById } = require('./userFunctions')
const { sendEmail } = require('./emailSend')
const messages = require('./emailMessages')
const template = require('./emailTemplates')
const asyncHandler = require('./asyncErrorHanlder')

exports.collectEmail = asyncHandler(async (req, res, next) => {
  console.log(req.signedCookies)
  const { email } = req.signedCookies.user

  console.log(email)
  const user = await findUserByEmail(email)

  if (user && !user.confirmed) {
    sendEmail(template.confirm(user.id, user.email), messages.confirm)
    setTimeout(() => {
      res.status(200).json('Conformation Email in your inbox')
    }, 4000)
  } else {
    res.status(200).json({ message: messages.alreadyConfirmed })
  }
})

exports.confirmEmail = asyncHandler(async (req, res) => {
  const { id } = req.signedCookies.user

  const user = await findUserById(id)
  if (!user) {
    res.json({ message: messages.couldNotFind })
  } else if (user && !user.confirmed) {
    user
      .update({
        confirmed: true
      })
      .then(() => res.json({ message: messages.confirmed }))
      .catch(err => console.log(err))
  }
})
