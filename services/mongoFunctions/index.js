const { getCategory, getCategories, createCategory } = require('./categoryFunctions')
const { createComment, updateComment, deleteComment, getComment, verifyCommentUser } = require('./commentFunctions')
const { createRating, findRatingByRecId, updateRating, deleteRating, getRatings, getRating } = require('./ratingFunctions')
const { getAllRecs, getRecWithUser, createRec, updateRecs, deleteRecs, verifyRecUser, } = require('./recommendationFunctions')
const { createUser, deleteUser, updateUser, findUserByEmail, findUserByToken, findUserById, findUserByObj } = require('./userFunctions')

module.exports = {
    getCategory, getCategories, createCategory,
    createComment, updateComment, deleteComment, getComment, verifyCommentUser,
    createRating, findRatingByRecId, updateRating, deleteRating, getRatings, getRating,
    getAllRecs, getRecWithUser, createRec, updateRecs, deleteRecs, verifyRecUser,
    createUser, deleteUser, updateUser, findUserByEmail, findUserByToken, findUserById, findUserByObj
}