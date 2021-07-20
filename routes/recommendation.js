const express = require('express')
const router = express.Router()
const { isObjectEqual } = require('../models/MongoFunctions/isObjectEqual')
const { authenticateToken } = require('../auth')
const { validateRecommendation, asyncErrorHandler } = require('../services/middleware')
const {
  getAllRecs,
  createRec,
  updateRecs,
  deleteRecs,
  getRecWithUser,
  getRecWithRating,
  isRecAuthUser
} = require('../services/mongoFunctions')
const { findRatingByRecId, deleteRating } = require('../services/mongoFunctions/ratingFunctions')

// GET /recs status: 200 - Returns a list of recommendations (including the user that owns each recommendation)
router.get(
  '/recs',
  asyncErrorHandler(async (req, res) => {
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
  asyncErrorHandler(async (req, res) => {
    const { id } = req.params
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
  asyncErrorHandler(async (req, res) => {
    const { body, user, params } = req
    const { id } = params

    const recs = await createRec(user, body, id)
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
  asyncErrorHandler(async (req, res) => {
    const { body, user, params } = req
    const { id } = params

    if (await isRecAuthUser(id, user)) {
      const recommendation = await updateRecs(id, body)
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
  asyncErrorHandler(async (req, res) => {
    const { params, user } = req
    const { id } = params

    if (await isRecAuthUser(id, user)) {
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
