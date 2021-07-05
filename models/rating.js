const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ratingSchema = new Schema(
  {
    rating: { type: Number, required: true },
    rec: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recommendation',
      required: [true, 'recommendation Id required for this rating']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'user Id required for this rating']
    }
  },
  {
    timestamps: true
  }
)

const Rating = mongoose.model('Rating', ratingSchema)

module.exports = Rating



// module.exports = (sequelize, DataTypes) => {
//   const Rating = sequelize.define(
//     'Rating',
//     {
//       rate: DataTypes.INTEGER,
//       recid: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//       },
//       userid: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//       },
//     },
//     {}
//   );
//   Rating.associate = models => {
//     Rating.belongsTo(models.User, {
//       as: 'userRating',
//       foreignKey: {
//         fieldName: 'userid',
//         allowNull: false,
//       },
//     });
//     Rating.belongsTo(models.Recommendation, {
//       as: 'rating',
//       foreignKey: {
//         fieldName: 'recid',
//         allowNull: false,
//       },
//     });
//   };
//   return Rating;
// };
