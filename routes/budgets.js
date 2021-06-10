const express = require('express');
router = express.Router();
const { isLoggedIn, budgetCat } = require('../middleware')
const catchAsync = require('../utils/catchAsync')
const budgets = require('../controllers/budgets')
const Budget = require('../models/budget')
const Transaction = require('../models/transaction')
const Category = require('../models/category')

router.get('/', isLoggedIn, catchAsync(budgets.index))

router.post('/', budgetCat, isLoggedIn, catchAsync(budgets.createBudget))

router.get('/new', isLoggedIn, catchAsync(budgets.renderNewBudgetForm))

router.get('/:id', isLoggedIn, catchAsync(budgets.showBudget))

router.get('/:id/edit', isLoggedIn, catchAsync(budgets.renderEditForm))

router.post('/:id', budgetCat, catchAsync(budgets.updateBudget))

router.delete('/:id', isLoggedIn, catchAsync(budgets.deleteBudget))

module.exports = router