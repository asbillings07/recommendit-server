const { Rating, User, Recommendation } = require('../models')
const { createAddModel } = require('./createAddModel')

// verifies user by checking the rating where the recommendation id is equal to the param id
const findRatingByRecId = (id) =>
  Rating.findOne({
    recid: id
  }
  )
const getRating = (id) => Rating.findOne({ userid: id })
// get all ratings for the authed user
const getRatings = (id) => Rating.find({ userid: id })
// creates a rating on a given recommendation
const createRating = (id, user, body) => {
  const data = {
    rate: body.rate,
    recid: id,
    userid: user._id
  }
  return createAddModel(Recommendation, id, Rating, data, 'ratings')
}

// updates rating on a given recommendation for user
const updateRating = (id, body) =>
  Rating.updateOne({ recid: id }, {
    rate: body.rate
  })
// deletes a rating along with their comments for user.
const deleteRating = (id) =>
  Rating.deleteOne({ recid: id })

module.exports = {
  createRating,
  findRatingByRecId,
  updateRating,
  deleteRating,
  getRatings,
  getRating
}
