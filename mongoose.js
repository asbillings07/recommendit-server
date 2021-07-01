const mongoose = require('mongoose')
const logger = require('./logger')

// Models

const Category = require('./models/category')
const Comment = require('./models/comment')
const Recommendation = require('./models/recommendation')
const Rating = require('./models/rating')
const User = require('./models/user')

module.exports = (config) => {
    const options = {
        socketTimeoutMS: 30000,
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        promiseLibrary: global.Promise
    }

    const connectToDB = () => {
        mongoose.connect(config.databaseUrl, options)
    }
    // CONNECTION EVENTS
    // When successfully connected
    mongoose.connection.on('connected', () => {
        logger.debug('Mongoose default connection open')
    })

    // If the connection throws an error
    mongoose.connection.on('error', (err) => {
        logger.debug('Mongoose default connection error: ' + err)
    })

    // When the connection is disconnected
    mongoose.connection.on('disconnected', (event, error) => {
        console.log('logger?', logger)
        console.log('event???', event, error)
        logger.debug('Mongoose connection was disconnected' + event)
        logger.debug('Reconnecting...')
        connectToDB()
    })

    connectToDB()
}
