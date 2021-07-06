const { getCategory, getCategories, createCategory } = require('./categoryFunctions')
const { createComment, updateComment, deleteComment, getComment, isCommentAuthUser } = require('./commentFunctions')
const { createRating, findRatingByRecId, updateRating, deleteRating, getRatings, getRating } = require('./ratingFunctions')
const { getAllRecs, getRecWithUser, createRec, updateRecs, deleteRecs, isRecAuthUser, } = require('./recommendationFunctions')
const { createUser, deleteUser, updateUser, findUserByEmail, findUserByToken, findUserById, findUserByObj, addSavedRecommendation } = require('./userFunctions')

module.exports = {
    getCategory, getCategories, createCategory,
    createComment, updateComment, deleteComment, getComment, isCommentAuthUser,
    createRating, findRatingByRecId, updateRating, deleteRating, getRatings, getRating,
    getAllRecs, getRecWithUser, createRec, updateRecs, deleteRecs, isRecAuthUser,
    createUser, deleteUser, updateUser, findUserByEmail, findUserByToken, findUserById, findUserByObj, addSavedRecommendation
}