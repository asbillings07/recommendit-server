const { Recommendation, User, Rating, Comment } = require('../models');

// verifies user by checking the recommendation where the recommendation id is equal to the param id
const verifyUser = id =>
  Recommendation.findById(id);

// create recommendation

const createRec = (user, rec, id) =>
  Recommendation.create({
    categoryId: id,
    userid: user.id,
    title: rec.title,
    description: rec.description,
    location: rec.location,
    lastvisited: rec.lastvisited,
  });

// get all Recommendations including User and Rating

const getAllRecs = () =>
  Recommendation.find({}).populate('users').populate('ratings').populate('comments')


// get one Recommendation with id and include User and Ratings
const getRecWithUser = id =>
  Recommendation.findById(id).populate('users').populate('ratings').populate('comments')


// Update one Recommendation by Id
const updateRecs = (id, body) =>
  Recommendation.updateOne({ _id: id }, {
    categoryId: body.categoryId,
    title: body.title,
    description: body.description,
    location: body.location,
    lastVisited: body.lastVisited,
  })

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
