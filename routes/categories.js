const express = require('express');
router = express.Router();
const { isLoggedIn } = require('../middleware')
const catchAsync = require('../utils/catchAsync')
const { validateCategory } = require('../schemas.js')
const categories = require('../controllers/categories')
const Category = require('../models/category')


router.get('/', isLoggedIn, catchAsync(categories.index))

router.post('/', isLoggedIn, validateCategory, catchAsync(categories.createCategory))

router.get('/:id/edit', isLoggedIn, catchAsync(categories.renderEditForm))

router.put('/:id', isLoggedIn, validateCategory, catchAsync(categories.updateCategory))

router.delete('/:id', isLoggedIn, catchAsync(categories.deleteCategory))

module.exports = router