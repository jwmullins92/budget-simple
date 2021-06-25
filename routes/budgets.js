const express = require('express');
router = express.Router();
const { isLoggedIn, budgetCat } = require('../middleware')
const { validateBudgetBreakdown, validateBudget } = require('../schemas')
const catchAsync = require('../utils/catchAsync')
const budgets = require('../controllers/budgets')

// MIDDLEWARE
// isLoggedIn = Verifies user is logged in
// budgetCat = Formats category and budget amount data so it will be accepted by the Budget Model
// validateBudgetBreakdown = Validates the nested categories document on the Budget Model
// validateBudget = Validates the budget model

// Index routes
router.route('/')
    .get(isLoggedIn, catchAsync(budgets.index))
    .post(isLoggedIn, budgetCat, validateBudget, catchAsync(budgets.createBudget));


// new routes
router.route('/new')
    .get(isLoggedIn, catchAsync(budgets.renderNewBudgetForm));

// show/delete routes
router.route('/:id')
    .get(isLoggedIn, catchAsync(budgets.showBudget))
    .post(isLoggedIn, budgetCat, validateBudget, catchAsync(budgets.updateBudget))
    .patch(isLoggedIn, budgetCat, validateBudgetBreakdown, catchAsync(budgets.updateBudgetItem))
    .delete(isLoggedIn, catchAsync(budgets.deleteBudget))


// edit routes
router.route('/:id/edit')
    .get(isLoggedIn, catchAsync(budgets.renderEditForm))

// show fixed routes
router.route('/:id/fixed')
    .get(isLoggedIn, catchAsync(budgets.showFixed))

// show flex routes
router.route('/:id/flex')
    .get(isLoggedIn, catchAsync(budgets.showFlex))





module.exports = router