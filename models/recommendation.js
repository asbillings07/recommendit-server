
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recommendationSchema = new Schema(
  {
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: [true, 'categoryId required'] },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'userId required'] },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    lastVisited: Date,
    ratings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating'
      }
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',

      }
    ]
  },
  {
    timestamps: true
  }
)

const Recommendation = mongoose.model('Recommendation', recommendationSchema)

module.exports = Recommendation
// module.exports = (sequelize, DataTypes) => {
//   const Recommendation = sequelize.define(
//     'Recommendation',
//     {
//       categoryId: DataTypes.INTEGER,
//       userid: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//       },
//       title: DataTypes.STRING,
//       description: DataTypes.STRING,
//       location: DataTypes.STRING,
//       lastvisited: DataTypes.DATE,
//     },
//     {}
//   );
//   Recommendation.associate = models => {
//     Recommendation.belongsTo(models.User, {
//       foreignKey: 'userid',
//     });
//     Recommendation.hasMany(models.Rating, {
//       as: 'rating',
//       onDelete: 'CASCADE',
//       foreignKey: {
//         field: 'recid',
//       },
//     });
//     Recommendation.belongsTo(models.Category, {
//       foreignKey: {
//         field: 'categoryId',
//       },
//     });

//     Recommendation.hasMany(models.Comment, {
//       foreignKey: {
//         field: 'recid',
//       },
//     });
//   };
//   return Recommendation;
// };
