const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: [true, 'comment required']
    },
    recid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recommendation',
      required: [true, 'recommendation Id required for this comment']
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'recommendation Id required for this comment']
    }
  },
  {
    timestamps: true
  }
)

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment



// module.exports = (sequelize, DataTypes) => {
//   const Comment = sequelize.define(
//     'Comment',
//     {
//       comment: {
//         type: DataTypes.STRING,
//         validate: {
//           notEmpty: {
//             msg: 'Comment Required',
//           },
//         },
//       },
//       userid: DataTypes.INTEGER,
//       recid: DataTypes.INTEGER,
//     },
//     {}
//   );
//   Comment.associate = models => {
//     Comment.belongsTo(models.User, {
//       as: 'userComments',
//       foreignKey: {
//         fieldName: 'userid',
//         allowNull: false,
//       },
//     });

//     Comment.belongsTo(models.Recommendation, {
//       foreignKey: {
//         fieldName: 'recid',
//         allowNull: false,
//       },
//     });
//   };
//   return Comment;
// };
