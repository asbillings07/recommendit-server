const user = require('./20190714001448-create-user');
const category = require('./20190714001936-create-category');
const recommendation = require('./20190714002002-create-recommendation')
const rating = require('./20190714002038-create-rating')
const savedRec = require('./20190714002101-create-saved-rec')
const comment = require('./20190804223610-create-comment')

const createTables = async (db, sequelize) => {
    await user.up(db, sequelize)
    await category.up(db, sequelize)
    await recommendation.up(db, sequelize)
    await rating.up(db, sequelize)
    await savedRec.up(db, sequelize)
    await comment.up(db, sequelize)
}

const dropTables = (db, sequelize) => {
    user.down(db, sequelize)
    category.down(db, sequelize)
    recommendation.down(db, sequelize)
    rating.down(db, sequelize)
    savedRec.down(db, sequelize)
    comment.down(db, sequelize)
}

module.exports = {
    createTables,
    dropTables
}