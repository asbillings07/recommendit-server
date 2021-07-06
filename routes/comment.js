const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../auth')
const { isObjectEqual } = require('../models/MongoFunctions/isObjectEqual')
const { validateComment } = require('../services/middleware');
const { asyncErrorHandler } = require('../services/middleware');
const {
  createComment,
  updateComment,
  deleteComment,
  getComment,
  isCommentAuthUser
} = require('../services/mongoFunctions');

// POST /rec/comment status: 201 - creating a new rating for a given recommendation
router.post(
  '/rec/:id/comment',
  authenticateToken,
  validateComment,
  asyncErrorHandler(async (req, res) => {
    const { body, params, user } = req
    const { id } = params;

    const comment = await createComment(id, body, user);
    if (comment) {
      res.status(201).json(comment);
    } else {
      res.status(404).json({ error: '404 Not found' });
    }
  })
);

router.put(
  '/rec/:id/comment',
  authenticateToken,
  validateComment,
  asyncErrorHandler(async (req, res) => {
    const { body, user } = req
    const { commentId } = body

    if (await isCommentAuthUser(commentId, user)) {
      const updatedComment = await updateComment(commentId, body);
      res.status(201).json(updatedComment);
    } else {
      res
        .status(403)
        .json({ message: 'You can not update comments you do not own' });
    }
  })
);

router.delete(
  '/rec/:id/comment',
  authenticateToken,
  asyncErrorHandler(async (req, res) => {
    const { body, user } = req
    const { commentId } = body;

    if (await isCommentAuthUser(commentId, user)) {
      await deleteComment(commentId);
      res.status(200).json({ message: 'comment deleted!' });
    } else {
      res.status(403).json({
        message: 'You can not delete recommendations that you do not own',
      });
    }
  })
);

// GET /comment status 200 - gets all comments for a user
// router.get('comment', async (req, res) => {});

module.exports = router;
