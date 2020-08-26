const express = require('express')
require('dotenv').config()
const router = express.Router()
const bcrypt = require('bcryptjs')
const config = require('../Config')
const jwt = require('jsonwebtoken')
const { authenicateToken } = require('../services/authToken')
const { authenticateUser } = require('../app')
const { validateUser, validateUpdateUser } = require('../services/validationChain')
const { collectEmail, confirmEmail } = require('../services/emailController')
const asyncHandler = require('../services/asyncErrorHanlder')
const {
  createUser,
  deleteUser,
  updateUser,
  findUserByEmail,
  findUserByObj,
  updateUserPhoto
} = require('../services/userFunctions')

// Authentication Route
router.post(
  '/login',
  asyncHandler(async (req, res, next) => {
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

        const token = jwt.sign(authUser, config.jwtSecret)
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
  authenticateUser,
  asyncHandler(async (req, res) => {
    const { id } = req.user
    const user = await findUserByObj({ id })
    res.status(200).json(user)
  })
)
// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns 'User created succesfully'
router.post(
  '/users',
  validateUser,
  asyncHandler(async (req, res) => {
    const user = req.body
    const newUser = await createUser(user)
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
  authenticateUser,
  collectEmail,
  asyncHandler(async (req, res) => {
    const { id } = req.user
    const body = req.body
    await updateUser(id, body)
    res.status(204).end()
  })
)

router.post(
  '/userphoto',
  authenticateUser,
  asyncHandler(async (req, res) => {
    const { id } = req.user
    const body = req.body
    await updateUserPhoto(id, body)
    res.status(204).end()
  })
)
// DELETE (Careful, this deletes users from the DB) /api/users 204 - deletes a user, sets the location to '/', and returns no content
router.delete(
  '/users',
  authenticateUser,
  asyncHandler(async (req, res) => {
    const { user } = req
    await deleteUser(user)
    res.status(204).location('/').end()
  })
)

router.post('/email', collectEmail)
router.get('/email/confirm', authenticateUser, confirmEmail)

module.exports = router
