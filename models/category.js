const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'title required']
    },
    recommendations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recommendation'
      }
    ]
  },
  {
    timestamps: true
  }
)

const Category = mongoose.model('Category', categorySchema)

module.exports = Category


// module.exports = (sequelize, DataTypes) => {
//   const Category = sequelize.define(
//     'Category',
//     {
//       title: DataTypes.STRING,
//     },
//     {}
//   );
//   Category.associate = models => {
//     Category.hasMany(models.Recommendation, {
//       foreignKey: {
//         fieldName: 'categoryId',
//         allowNull: false,
//       },
//     });
//   };
//   return Category;
// };
