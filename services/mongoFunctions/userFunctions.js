const { User, Recommendation, Token } = require('../../models')
const bcrypt = require('bcryptjs')
const { saltRounds } = require('../../config');

const createSaltHash = async (text, size) => {
  try {
    const salt = await bcrypt.genSalt(size);
    return await bcrypt.hash(text, salt);
  } catch (err) {
    return err
  }
}

const findUserByObj = obj =>
  User.findOne(obj).populate({
    path: 'savedRecommendations', populate: {
      path: 'ratings',
    }
  }).populate({
    path: 'savedRecommendations', populate: {
      path: 'comments'
    }
  })

// creates user and hashes password
const createUser = async user => {
  const checkedUser = await findUserByObj({ email: user.email })
  if (!checkedUser) {
    const hashedPassword = await createSaltHash(user.password, saltRounds)
    const createdUser = new User({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: hashedPassword
    })
    return createdUser.save()
  } else {
    throw new Error('email has already been taken!')
  }

}

// Finds authed user by id then updates user and hashes password if needed
const updateUser = (id, body) => {
  return User.findByIdAndUpdate({ _id: id }, body, { new: true })
}

const addSavedRecommendation = (recId, userId) => User.findByIdAndUpdate(
  { _id: userId },
  { $push: { ['savedRecommendations']: recId } },
  { new: true, useFindAndModify: false }
)

// finds an authed user id then deletes a user
const deleteUser = id =>
  User.deleteOne({
    _id: id
  })

// find user by email
const findUserByEmail = email =>
  User.findOne({ email }).select("+password")
// find user by ForgotPasswordToken
const findUserByToken = token =>
  User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: {
      $gte: Date.now()
    }
  })

const addUserToken = (userId, hashedToken) => new Token({
  userId,
  token: hashedToken,
  createdAt: Date.now()
}).save()

const findTokenByUser = (userId) => Token.findOne({ userId })

const findUserById = id =>
  User.findOne({ _id: id })






module.exports = {
  createUser,
  deleteUser,
  updateUser,
  findUserByEmail,
  findUserByToken,
  findUserById,
  findUserByObj,
  addSavedRecommendation,
  findTokenByUser,
  addUserToken,
  createSaltHash
}
