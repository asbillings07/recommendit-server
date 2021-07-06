const { User, Recommendation } = require('../../models')
const bcrypt = require('bcryptjs')
const { saltRounds } = require('../../config')

const createSaltHash = async (text, size) => {
  try {
    const salt = await bcrypt.genSalt(size);
    return await bcrypt.hash(text, salt);
  } catch (err) {
    return err
  }
}

const findUserByObj = obj =>
  User.findOne(obj).populate('recommendations').select('-password')

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

// finds an authed user id then deletes a user
const deleteUser = currentUser =>
  User.deleteOne({
    id: currentUser._id
  })

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




module.exports = {
  createUser,
  deleteUser,
  updateUser,
  findUserByEmail,
  findUserByToken,
  findUserById,
  findUserByObj
}
