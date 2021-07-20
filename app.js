
const env = process.env.NODE_ENV || 'development'
const express = require('express')
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
const Sentry = require('@sentry/node')
const config = require('./config')
const logger = require('./logger')
require('./mongoose')(config[env])
Sentry.init({
  dsn: 'https://646a0f42f7b54b3db2377c78174bdb4f@sentry.io/1726096'
})

// The request handler must be the first middleware on the app
const formData = require('express-form-data')
// required to show HTTP requests in console
const cors = require('cors')
const passport = require('passport')
require('dotenv').config()

const app = express()
exports.app = app
app.use(Sentry.Handlers.requestHandler())

/// whitelisting for Cors
const whitelist = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:3001',
  'https://recommendit.netlify.app',
  'https://recommendit.netlify.com',
  'https://sentry.io'
]
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors({ credentials: true, origin: corsOptions }))
app.use(formData.parse())
logger.debug("Overriding 'Express' logger")
app.use(require('morgan')('combined', { stream: logger.stream }))
app.use(cookieParser(config.cookieParserSecret))
app.use(bodyParser.json())
app.use(passport.initialize())

// route requires
const userRoute = require('./routes/user')
const recommendationRoute = require('./routes/recommendation')
const categoryRoute = require('./routes/category')
const ratingRoute = require('./routes/rating')
const passwordReset = require('./routes/passwordReset')
const commentRoute = require('./routes/comment')

// api routes
app.use('/api', userRoute)
app.use('/api', recommendationRoute)
app.use('/api', categoryRoute)
app.use('/api', ratingRoute)
app.use('/api', passwordReset)
app.use('/api', commentRoute)
logger.debug("Overriding 'Express' logger")
app.use(require('morgan')('combined', { stream: logger.stream }))


app.get('/', (req, res, next) => {
  res.json({
    message: 'Welcome to the recommendation App!'
  })
})

// POST - Uploads photos to cloudinary storage
// app.post('/api/profile-upload', (req, res) => {
//   const values = req.files;

//   cloudinary.uploader.upload(values.path, (error, result) =>
//     console.log(result, error)
//   );
// });

// Sentry Error Hanlder
app.use(
  Sentry.Handlers.errorHandler({
    shouldHandleError (error) {
      // Capture all 404 and 500 errors
      if (error.status >= 100 && error.status < 600) {
        return true
      }
      return false
    }
  })
)

// global error handler
app.use('*', (req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {
  res.locals.error = err
  if (err.status >= 100 && err.status < 600) {
    res.status(err.status).json({ err })
    console.log(err.status)
    console.log(err.message)
    console.log(err.stack)
  } else {
    res.status(500).json({ message: 'an internal server error occured' })
    console.log(500)
    console.log(err.message)
    console.log(err.stack)
  }
})


// sets port
const PORT = config[env].port
// creates server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})
