const { Recommendation, User, Rating, Comment, Category } = require('../models');
const { createAddModel } = require('./createAddModel')
// verifies user by checking the recommendation where the recommendation id is equal to the param id
const verifyUser = id =>
  Recommendation.findById(id);

// create recommendation

const createRec = (user, rec, id) => {
  const data = {
    categoryId: id,
    user: user.id,
    title: rec.title,
    description: rec.description,
    location: rec.location,
    lastVisited: rec.lastVisited,
  }
  return createAddModel(Category, id, Recommendation, data, 'recommendations')
}

// get all Recommendations including User and Rating

const getAllRecs = () =>
  Recommendation.find({}).populate('users').populate('ratings').populate('comments')


// get one Recommendation with id and include User and Ratings
const getRecWithUser = id =>
  Recommendation.findById(id).populate('user').populate('ratings').populate('comments')


// Update one Recommendation by Id
const updateRecs = (id, body) =>
  Recommendation.updateOne({ _id: id }, body)

// Delete Recommendation by Id
const deleteRecs = id =>
  Recommendation.findOne({ _id: id })

module.exports = {
  getAllRecs,
  getRecWithUser,
  createRec,
  updateRecs,
  deleteRecs,
  verifyUser,
};
