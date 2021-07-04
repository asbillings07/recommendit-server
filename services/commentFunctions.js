const { Comment, Recommendation } = require('../models');

// verifies user by checking the comment where the recommendation id is equal to the param id
const verifyUser = id =>
  Comment.findOne({
    rec: id,
  });

// create comment
const createComment = (id, body, user) => {
  const data = {
    comment: body.comment,
    rec: id,
    user: user._id,
  }
  return createAddModel(Recommendation, id, Comment, data, 'comments')
}
// update comment
const updateComment = (id, body) =>
  Comment.updateOne({ rec: id }, {
    comment: body.comment,
  }
  );
// gets comment
const getComment = id => Comment.findOne({ rec: id });
// deletes comment
const deleteComment = id =>
  Comment.deleteOne({ rec: id })

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getComment,
  verifyUser,
};
