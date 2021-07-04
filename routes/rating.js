const { authenticateToken } = require('../auth')
const express = require('express')
const router = express.Router()
const { validateRating } = require('../services/validationChain')
const asyncHandler = require('../services/asyncErrorHanlder')
const {
  createRating,
  findRatingByRecId,
  updateRating,
  deleteRating,
  getRatings
} = require('../services/ratingFunctions')

// GET /rating status 200 - gets all ratings for user
router.get('/rating', authenticateToken, async (req, res) => {
  const userId = req.user.id
  const ratings = await getRatings(userId)
  res.status(200).json(ratings)
})
// POST /rating/recs/:id status: 201 - creating a new rating for a given recommendation
router.post(
  '/rating/recs/:id',
  authenticateToken,
  validateRating,
  asyncHandler(async (req, res) => {
    const body = req.body
    const id = req.params.id
    const user = req.user
    const rating = await createRating(id, user, body)
    res.status(201).json(rating)
  })
)
// PUT /rating/recs/:id - status: 204 - updates a rating for an existing recommendaion if the user owns the rating - returns no content.
router.put(
  '/rating/recs/:id',
  authenticateToken,
  validateRating,
  asyncHandler(async (req, res) => {
    const { body, params, user } = req
    const { id } = params
    const rating = await findRatingByRecId(id)

    if (user) {
      if (rating !== null) {
        await updateRating(id, body)
        res.status(200).json({
          message: 'rating updated!'
        })
      } else {
        await createRating(id, user, body)
        res.status(200).json({
          message: 'rating created!'
        })
      }
    } else {
      res.status(403).json({
        message: 'You can not edit ratings or comments if you are not logged in'
      })
    }
  })
)
// DELETE /rating/recs/:id - status: 204 - deletes a rating for an existing recommendaion if the user owns the rating - returns no content.
router.delete(
  '/rating/recs/:id',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const id = req.params.id
    const user = req.user
    const rating = await findRatingByRecId(id)
    if (rating.user === user.id) {
      await deleteRating(id)
      res.status(204).end()
    } else {
      res.status(403).json({
        error: '403 Forbidden',
        message: 'You can not delete ratings or comments that you do not own'
      })
    }
  })
)

module.exports = router
