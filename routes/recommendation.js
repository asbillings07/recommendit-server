const express = require('express')
const router = express.Router()
const { isObjectEqual } = require('../models/MongoFunctions/isObjectEqual')
const { authenticateToken } = require('../auth')
const { validateRecommendation } = require('../services/validationChain')
const asyncHandler = require('../services/asyncErrorHanlder')
const {
  getAllRecs,
  createRec,
  updateRecs,
  deleteRecs,
  getRecWithUser,
  getRecWithRating,
  verifyUser
} = require('../services/recommendationFunctions')
const { findRatingByRecId, deleteRating } = require('../services/ratingFunctions')

// GET /recs status: 200 - Returns a list of recommendations (including the user that owns each recommendation)
router.get(
  '/recs',
  asyncHandler(async (req, res) => {
    const recs = await getAllRecs()
    if (recs) {
      res.status(200).json(recs)
    } else {
      res.status(404).json({
        error: '404 Not Found',
        message: 'Recommendation not found at selected route'
      })
    }
  })
)

//GET /recs/:id  status: 200 - Returns a recommendation (including the user that owns the recommendation) for the provided recommendation ID
router.get(
  '/recs/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id
    const rec = await getRecWithUser(id)
    if (rec) {
      res.status(200).json(rec)
    } else {
      res.status(404).json({
        error: '404 Not Found',
        message: 'Recommendation not found at selected route'
      })
    }
  })
)

//POST /recs status: 201 - Creates a recommendation, sets the Location header to the URI for the recommendation, and returns no content
router.post(
  '/recs/category/:id',
  authenticateToken,
  validateRecommendation,
  asyncHandler(async (req, res) => {
    const id = req.params.id
    const user = req.user
    const rec = req.body
    const recs = await createRec(user, rec, id)
    if (recs) {
      res.status(201).json(recs)
    } else {
      res.status(404).json({
        error: '404 Not Found',
        message: 'Recommendation not found at selected route'
      })
    }
  })
)

//PUT /recs/:id status: 204 - Updates a recommendation if the user owns it, and returns no content
router.put(
  '/recs/:id',
  validateRecommendation,
  authenticateToken,
  asyncHandler(async (req, res) => {
    const id = req.params.id
    const user = req.user
    const rec = req.body
    const authedUser = await verifyUser(id)
    if (isObjectEqual(authedUser.user, user.id)) {
      const recommendation = await updateRecs(id, rec)
      res.status(200).json(recommendation)
    } else {
      res.status(401).json({
        message: 'You can not edit recommendations that you do not own.'
      })
    }
  })
)
//DELETE - recs/:id status: 204 - deletes a recommendation if user owns it. Careful, this can not be undone. Deletes a recommendation and returns no content
router.delete(
  '/recs/:id',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const id = req.params.id
    const user = req.user
    const authedUser = await verifyUser(id)
    if (isObjectEqual(authedUser.user, user.id)) {
      if (await findRatingByRecId(id)) {
        await deleteRating(id)
        await deleteRecs(id)
        res.status(204).end()
      } else {
        await deleteRecs(id)
        res.status(200).json({ message: 'recommendation deleted' })
      }
    } else {
      res.status(401).json({
        message: 'You can not delete recommendations that you do not own.'
      })
    }
  })
)
module.exports = router
