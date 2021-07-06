const { authenticateToken } = require('../auth')
const express = require('express')
const router = express.Router()
const { isObjectEqual } = require('../models/MongoFunctions/isObjectEqual')
const { validateRating, asyncErrorHandler } = require('../services/middleware')
const {
  createRating,
  findRatingByRecId,
  updateRating,
  deleteRating,
  getRatings,
  getRating,
  isRatingAuthUser
} = require('../services/mongoFunctions')

// GET /rating status 200 - gets all ratings for user
router.get('/rating', authenticateToken, asyncErrorHandler(async (req, res) => {
  const userId = req.user.id
  const ratings = await getRatings(userId)
  res.status(200).json(ratings)
}))
// POST /rating/recs/:id status: 201 - creating a new rating for a given recommendation
router.post(
  '/rec/:id/rating',
  authenticateToken,
  validateRating,
  asyncErrorHandler(async (req, res) => {
    const body = req.body
    const id = req.params.id
    const user = req.user
    const rating = await createRating(id, user, body)
    res.status(201).json(rating)
  })
)
// PUT /rating/recs/:id - status: 204 - updates a rating for an existing recommendaion if the user owns the rating - returns no content.
router.put(
  '/rec/:id/rating',
  authenticateToken,
  validateRating,
  asyncErrorHandler(async (req, res) => {
    const { body, user } = req
    const { ratingId } = body
    const rating = await getRating(ratingId)

    if (isRatingAuthUser(ratingId, user)) {
      if (rating !== null) {
        const updatedRating = await updateRating(rating.id, body)
        res.status(200).json(updatedRating)
      }
    } else {
      res.status(403).json({
        message: 'You can not edit ratings that do not belong to you'
      })
    }
  })
)
// DELETE /rating/recs/:id - status: 204 - deletes a rating for an existing recommendaion if the user owns the rating - returns no content.
router.delete(
  '/rec/:id/rating',
  authenticateToken,
  asyncErrorHandler(async (req, res) => {
    const { user, body } = req
    const { ratingId } = body

    if (isRatingAuthUser(ratingId, user)) {
      await deleteRating(ratingId)
      res.status(200).json('rating deleted!')
    } else {
      res.status(403).json({
        error: '403 Forbidden',
        message: 'You can not delete ratings or comments that you do not own'
      })
    }
  })
)

module.exports = router
