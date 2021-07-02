const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    firstName: { type: String, required: [true, 'First name required'] },
    lastName: { type: String, required: [true, 'Last name required'] },
    email: { type: String, required: [true, 'email required'] },
    password: { type: String, required: [true, 'password required'] },
    city: String,
    state: String,
    resetPasswordExpires: String,
    resetPasswordToken: String,
    confirmed: String,
    photoName: String,
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

// module.exports = (sequelize, DataTypes) => {
//   const User = sequelize.define(
//     'User',
//     {
//       firstName: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       lastName: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       password: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       resetPasswordToken: {
//         type: DataTypes.STRING,
//       },
//       resetPasswordExpires: {
//         type: DataTypes.DATE,
//       },
//       confirmed: {
//         type: DataTypes.BOOLEAN,
//       },
//       photoName: {
//         type: DataTypes.STRING,
//       },
//       cloudImage: {
//         type: DataTypes.STRING,
//       },
//       imageId: {
//         type: DataTypes.STRING,
//       },
//       postDate: {
//         type: DataTypes.DATE,
//       },
//       isAdmin: {
//         type: DataTypes.BOOLEAN,
//       },
//     },
//     {}
//   );
//   User.associate = models => {
//     User.hasMany(models.Recommendation, {
//       foreignKey: {
//         fieldName: 'userid',
//       },
//     });
//     User.hasMany(models.Rating, {
//       as: 'userRating',
//       foreignKey: {
//         fieldName: 'userid',
//         allowNull: false,
//       },
//     });
//     User.hasMany(models.SavedRec, {
//       as: 'userSavedRecs',
//       foreignKey: {
//         fieldName: 'userid',
//         allowNull: false,
//       },
//     });

//     User.hasMany(models.Comment, {
//       as: 'userComments',
//       foreignKey: {
//         fieldName: 'userid',
//         allowNull: false,
//       },
//     });
//   };
//   return User;
// };
