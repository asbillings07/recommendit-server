const jwt = require('jsonwebtoken')
const config = require('../config')

exports.authenicateToken = (req, res, next) => {
  const header = req.headers.authorization
  const key = config.jwtSecret

  if (typeof header !== 'undefined') {
    const bearer = header.split(' ')
    const token = bearer[1]
    jwt.verify(token, key, (err, payload) => {
      if (err) {
        res.status(400).send({
          error: err.name,
          message: err.message
        })
      } else {
        next()
      }
    })
  } else {
    res.status(400).send({
      error: 'Invalid Header',
      message:
        'Your header was not a valid JWT header, please check your headers and try again'
    })
  }
}
