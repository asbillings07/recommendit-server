/* eslint-disable */
const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label, prettyPrint, json } = format

// only show _doc property if $resource is logged
const maskFormat = format(info => {
  if (info._doc) {
    info._doc = info._doc
  }

  return info
})
var logger = createLogger({
  format: combine(json(), prettyPrint(), maskFormat()),
  transports: [
    new transports.File({
      level: 'info',
      filename: './logs/all-logs.log',
      handleExceptions: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false
    }),
    new transports.Console({
      level: 'debug',
      handleExceptions: true,
      colorize: true
    })
  ],
  exitOnError: false
})

/* override console.log with winston logger: */
let log = console.log
console.log = function hijacked_log(level) {
  if (arguments.length > 1 && level in this) {
    log.apply(this, arguments)
  } else {
    var args = Array.prototype.slice.call(arguments)
    args.unshift('debug')
    log.apply(this, args)
  }
}

module.exports = logger
module.exports.stream = {
  write: function(message, encoding) {
    logger.info(message)
  }
}
