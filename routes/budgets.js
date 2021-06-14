const express = require('express');
router = express.Router();
const { isLoggedIn, budgetCat } = require('../middleware')
const catchAsync = require('../utils/catchAsync')
const budgets = require('../controllers/budgets')
const Budget = require('../models/budget')
const Transaction = require('../models/transaction')
const Category = require('../models/category')

router.route('/')
    .get(isLoggedIn, catchAsync(budgets.index))
    .post(budgetCat, isLoggedIn, catchAsync(budgets.createBudget));

router.route('/new')
    .get(isLoggedIn, catchAsync(budgets.renderNewBudgetForm));

router.route('/:id')
    .get(isLoggedIn, catchAsync(budgets.showBudget))
    .post(budgetCat, catchAsync(budgets.updateBudget))
    .patch(budgetCat, isLoggedIn, catchAsync(budgets.updateBudgetItem))
    .delete(isLoggedIn, catchAsync(budgets.deleteBudget))

router.route('/:id/edit')
    .get(isLoggedIn, catchAsync(budgets.renderEditForm))

router.route('/:id/fixed')
    .get(isLoggedIn, catchAsync(budgets.showFixed))

router.route('/:id/flex')
    .get(isLoggedIn, catchAsync(budgets.showFlex))





module.exports = router