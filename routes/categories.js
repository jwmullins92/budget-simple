const express = require('express');
router = express.Router();
const { isLoggedIn } = require('../middleware')
const catchAsync = require('../utils/catchAsync')
const { validateCategory } = require('../schemas.js')
const categories = require('../controllers/categories')

// Middleware
// isLoggedIn = Verifies user is logged in
// validateCategory = Validates the Category Model

// Index routes
router.route('/')
    .get(isLoggedIn, catchAsync(categories.index))
    .post(isLoggedIn, validateCategory, catchAsync(categories.createCategory))

// show/delete routes
router.route('/:id')
    .put(isLoggedIn, validateCategory, catchAsync(categories.updateCategory))
    .delete(isLoggedIn, catchAsync(categories.deleteCategory))

// edit routes
router.route('/:id/edit')
    .get(isLoggedIn, catchAsync(categories.renderEditForm))

module.exports = router