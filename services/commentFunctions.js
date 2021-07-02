const { Comment } = require('../models');

// verifies user by checking the comment where the recommendation id is equal to the param id
const verifyUser = id =>
  Comment.findOne({
    recid: id,
  });

// create comment
const createComment = (id, body, user) =>
  Comment.create({
    comment: body.comment,
    recid: id,
    userid: user._id,
  });
// update comment
const updateComment = (id, body) =>
  Comment.updateOne({ recid: id }, {
    comment: body.comment,
  }
  );
// gets comment
const getComment = id => Comment.findOne({ recid: id });
// deletes comment
const deleteComment = id =>
  Comment.deleteOne({ recid: id })

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getComment,
  verifyUser,
};
