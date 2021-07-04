const {
  Category,
  User,
  Recommendation,
  Rating,
  Comment,
} = require('../models');
const { populate } = require('../models/category');

// create category

const createCategory = category => {
  const newCategory = new Category(category);

  console.log(newCategory)
  return newCategory.save()
}

const createManyCategories = categories => Category.insertMany(categories)

// get category

const getCategories = () => Category.find().populate({
  path: 'recommendations', populate: {
    path: 'user'
  }
});

// get one category

const getCategory = id => Category.findById(id).populate({
  path: 'recommendations', populate: {
    path: 'user'
  }
});

module.exports = {
  createCategory,
  getCategories,
  getCategory,
};
