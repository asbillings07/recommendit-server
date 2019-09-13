const express = require('express');
const router = express.Router();
require('dotenv').config();
const cloudinary = require('cloudinary');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { app, jwtOptions, authenticateUser } = require('../app');
const {
  validateUser,
  validateUpdateUser,
} = require('../services/validationChain');
const { collectEmail, confirmEmail } = require('../services/emailController');
const asyncHandler = require('../services/asyncErrorHanlder');
const {
  getUser,
  createUser,
  deleteUser,
  updateUser,
  findUserByEmail,
  findUserByObj,
} = require('../services/userFunctions');

// Cloudinary Config

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Authentication Route
router.post(
  '/login',
  asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (email && password) {
      let user = await findUserByEmail(email);
      if (user && bcrypt.compareSync(password, user.password)) {
        let payload = { id: user.id };
        let token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.json({
          message: 'ok',
          token: token,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            photo: user.photo,
          },
        });
      } else {
        res.status(401).json({ message: `Email or Password Incorrect` });
      }
    } else {
      res.status(401).json({ message: 'please enter email and password' });
    }
  })
);

// User Routes
//GET /api/users 200 - Returns the currently authenticated user
router.get(
  '/users',
  authenticateUser,
  asyncHandler(async (req, res) => {
    const id = req.user.id;
    console.log(id);
    const user = await findUserByObj({ id });
    res.status(200).json(user);
  })
);
//POST /api/users 201 - Creates a user, sets the Location header to "/", and returns 'User created succesfully'
router.post(
  '/users',
  validateUser,
  asyncHandler(async (req, res) => {
    const user = req.body;
    await createUser(user);
    res
      .location('/')
      .status(201)
      .json({
        message: `Account for ${user.firstName} Created Successfully!`,
      });
  })
);

// PUT /api/users - updates user and returns no content
router.put(
  '/users',
  validateUpdateUser,
  authenticateUser,
  collectEmail,
  asyncHandler(async (req, res) => {
    const userid = req.user.id;
    const body = req.body;
    await updateUser(userid, body);
    res.status(204).end();
  })
);
// DELETE (Careful, this deletes users from the DB) /api/users 204 - deletes a user, sets the location to '/', and returns no content
router.delete(
  '/users',
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.user;
    await deleteUser(user);
    res
      .status(204)
      .location('/')
      .end();
  })
);

router.post('/email', collectEmail);
router.get('/email/confirm/:id', confirmEmail);

// POST - Uploads photos to cloudinary storage
router.post('/profile-upload', (req, res) => {
  const values = Object.values(req.files);
  console.log(values);
  const promises = values.map(image => {
    console.log(image.path);
    cloudinary.v2.uploader.upload(image.path);
  });

  Promise.all(promises).then(results => res.json(results));
});

module.exports = router;
