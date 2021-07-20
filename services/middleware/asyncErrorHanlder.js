// HOF try/catch error handling
function asyncHandler (cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (err) {
      res.status(400).json(err.message)
      console.log('ERROR', err)

    }
  }
}

module.exports = asyncHandler
