const {
  Category,
  User,
  Recommendation,
  Rating,
  Comment,
} = require('../models');

// create category

const createCategory = category => Category.create(category);

const createManyCategories = categories => Category.insertMany(categories)

// get category

const getCategories = () => Category.find().exec({});

// get one category

const getCategory = id => Category.findById(id).populate('recommendations')

module.exports = {
  createCategory,
  getCategories,
  getCategory,
};
