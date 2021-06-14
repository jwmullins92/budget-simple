const express = require('express');
router = express.Router();
const { isLoggedIn } = require('../middleware')
const catchAsync = require('../utils/catchAsync')
const { validateCategory } = require('../schemas.js')
const categories = require('../controllers/categories')
const Category = require('../models/category')


router.route('/')
    .get(isLoggedIn, catchAsync(categories.index))
    .post(isLoggedIn, validateCategory, catchAsync(categories.createCategory))

router.route('/:id/edit')
    .get(isLoggedIn, catchAsync(categories.renderEditForm))

router.route('/:id')
    .put(isLoggedIn, validateCategory, catchAsync(categories.updateCategory))
    .delete(isLoggedIn, catchAsync(categories.deleteCategory))

module.exports = router