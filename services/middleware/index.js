const asyncErrorHandler = require('./asyncErrorHanlder')
const { validateUser,
    validateRecommendation,
    validateCategory,
    validateRating,
    validateEmail,
    validateComment,
    validateUpdateUser } = require('./validationChain')


module.exports = {
    validateUser,
    validateRecommendation,
    validateCategory,
    validateRating,
    validateEmail,
    validateComment,
    validateUpdateUser,
    asyncErrorHandler
}