const { Comment, Recommendation } = require('../../models');
const { createAddModel } = require('../createAddModel')
const { isObjectEqual } = require('../../models/MongoFunctions/isObjectEqual')

const isCommentAuthUser = async (id, user) => {
  const commentUser = await Comment.findById(id)
  return isObjectEqual(commentUser.user, user.id)
}

// create comment
const createComment = (id, body, user) => {
  const data = {
    comment: body.comment,
    rec: id,
    user: user.id,
  }
  return createAddModel(Recommendation, id, Comment, data, 'comments')
}
// update comment
const updateComment = (id, body) =>
  Comment.findByIdAndUpdate({ _id: id }, body, { new: true })
// gets comment
const getComment = id => Comment.findOne({ _id: id });
// deletes comment
const deleteComment = id =>
  Comment.deleteOne({ _id: id })

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getComment,
  isCommentAuthUser,
};
