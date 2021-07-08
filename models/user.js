const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    firstName: { type: String, required: [true, 'First name required'] },
    lastName: { type: String, required: [true, 'Last name required'] },
    email: { type: String, unique: true, required: [true, 'email required'] },
    password: { type: String, required: [true, 'password required'], select: false },
    city: String,
    state: String,
    zip: Number,
    resetPasswordExpires: String,
    resetPasswordToken: String,
    confirmed: String,
    photoName: String,
    photoUrl: String,
    cloudImage: String,
    imageId: String,
    postDate: String,
    roles: {
      type: Array,
      of: String,
      enum: ['Admin', 'SuperAdmin', 'User'],
    },
    savedRecommendations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recommendation'
      }
    ],
    ratings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating'
      }
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ]
  },
  {
    timestamps: true
  }
)

const User = mongoose.model('User', userSchema)

module.exports = User

