const { Rating, User, Recommendation } = require('../../models')
const { createAddModel } = require('../createAddModel')
const { isObjectEqual } = require('../../models/MongoFunctions/isObjectEqual')

const isRatingAuthUser = async (id, user) => {
  const ratingUser = await Rating.findById(id)
  return isObjectEqual(ratingUser.user, user.id)
}

// verifies user by checking the rating where the recommendation id is equal to the param id
const findRatingByRecId = (id) =>
  Rating.findOne({
    rec: id
  }
  )
const getRating = (id) => Rating.findOne({ _id: id })
// get all ratings for the authed user
const getRatings = (id) => Rating.find({ user: id })
// creates a rating on a given recommendation
const createRating = (id, user, body) => {
  const data = {
    rating: body.rating,
    rec: id,
    user: user.id
  }
  return createAddModel(Recommendation, id, Rating, data, 'ratings')
}

// updates rating on a given recommendation for user
const updateRating = (id, body) =>
  Rating.findByIdAndUpdate({ _id: id }, body, { new: true })
// deletes a rating along with their comments for user.
const deleteRating = (id) =>
  Rating.deleteOne({ _id: id })

module.exports = {
  createRating,
  findRatingByRecId,
  updateRating,
  deleteRating,
  getRatings,
  getRating,
  isRatingAuthUser
}
