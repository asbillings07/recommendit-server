require('dotenv').config()
const jwt = require('jsonwebtoken')
const config = require('../config')
const asyncHandler = require('../services/asyncErrorHanlder')

const authenticateToken = asyncHandler((req, res, next) => {
  const header = req.headers.authorization
  const key = config.jwtSecret

  if (typeof header !== 'undefined') {
    const bearer = header.split(' ')
    const token = bearer[1]

    jwt.verify(token, key, (err, payload) => {
      try {
        req.user = payload.sub
        next()
      } catch (error) {
        throw new Error(err.message)
      }
    })
  } else {
    res.status(400).send({
      error: 'Invalid Header',
      message:
        'Your header was not a valid JWT header, please check your headers and try again'
    })
  }
})

module.exports = {
  authenticateToken
}
