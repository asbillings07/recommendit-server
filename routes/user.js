const express = require('express')
require('dotenv').config()
const router = express.Router()
const bcrypt = require('bcryptjs')
const config = require('../config')
const { createToken, authenticateToken } = require('../auth')
const { validateUser, validateUpdateUser, asyncErrorHandler } = require('../services/middleware')
const { collectEmail, confirmEmail } = require('../services/emailController')
const {
  createUser,
  deleteUser,
  updateUser,
  findUserByEmail,
  findUserByObj,
  findUserById
} = require('../services/mongoFunctions')

// Authentication Route
router.post(
  '/login',
  asyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body

    if (email && password) {
      const user = await findUserByEmail(email)
      if (user && bcrypt.compareSync(password, user.password)) {
        const authUser = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          photo: user.photo
        }

        const token = createToken(authUser)
        res.cookie('user', authUser, { signed: true })
        res.json({
          message: 'ok',
          token: token,
          user: authUser
        })
      } else {
        res.status(401).json({ message: 'Email or Password Incorrect' })
      }
    } else {
      res.status(401).json({ message: 'please enter email and password' })
    }
  })
)

// User Routes
// GET /api/users 200 - Returns the currently authenticated user
router.get(
  '/users',
  authenticateToken,
  asyncErrorHandler(async (req, res) => {
    const { id } = req.user
    const user = await findUserByObj({ _id: id })
    res.status(200).json(user)
  })
)
// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns 'User created succesfully'
router.post(
  '/users',
  validateUser,
  asyncErrorHandler(async (req, res) => {
    const { body } = req
    const newUser = await createUser(body)
    const authedUser = newUser.dataValues

    res.cookie('user', authedUser, { signed: true })
    res
      .location('/')
      .status(201)
      .json({
        message: `Account for ${user.firstName} Created Successfully!`
      })
  })
)

// PUT /api/users - updates user and returns no content
router.put(
  '/users',
  validateUpdateUser,
  authenticateToken,
  asyncErrorHandler(async (req, res) => {
    const { user, body } = req
    const updatedUser = await updateUser(user.id, body)

    res.status(201).json(updatedUser)
  })
)
// DELETE (Careful, this deletes users from the DB) /api/users 204 - deletes a user, sets the location to '/', and returns no content
router.delete(
  '/users',
  authenticateToken,
  asyncErrorHandler(async (req, res) => {
    const { user } = req
    await deleteUser(user.id)
    res.status(204).location('/').end()
  })
)

router.post('/email', collectEmail)
router.get('/email/confirm', authenticateToken, confirmEmail)

module.exports = router
