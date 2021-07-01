const { User, Recommendation } = require('../models')
const bcrypt = require('bcryptjs')

// creates user and hashes password
const createUser = user => {
  return User.create({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: bcrypt.hashSync(user.password)
  })
}

// Finds authed user by id then updates user and hashes password if needed
const updateUser = (id, body) =>
  User.updateOne({ _id: id }, {
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email
  })

const updateUserPhoto = (id, body) =>
  User.updateOne({ _id: id }, {
    photoName: body.photoName,
    imageId: body.photoUrl
  })

// finds an authed user id then deletes a user
const deleteUser = currentUser =>
  User.findOne({
    where: {
      id: currentUser.id
    }
  }).then(user => user.destroy())

// find user by email

const findUserByEmail = email =>
  User.findOne({ email })
// find user by ForgotPasswordToken
const findUserByToken = token =>
  User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: {
      $gte: Date.now()
    }
  })

const findUserById = id =>
  User.findOne({ _id: id }).select('-password')

const findUserByObj = obj =>
  User.findOne({ obj }).populate('recommendations').select('-password')


module.exports = {
  createUser,
  deleteUser,
  updateUser,
  findUserByEmail,
  findUserByToken,
  findUserById,
  findUserByObj,
  updateUserPhoto
}
