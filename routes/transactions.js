const express = require('express');
router = express.Router();
const { isLoggedIn } = require('../middleware')
const catchAsync = require('../utils/catchAsync')
const { validateTransaction } = require('../schemas.js')
const transactions = require('../controllers/transactions')

// Middleware
// isLoggedIn = Verifies user is logged in
// validateTransaction = Validates Transaction Model

router.route('/')
    .get(isLoggedIn, catchAsync(transactions.index))
    .post(isLoggedIn, catchAsync(transactions.createTransaction))

router.route('/new')
    .get(isLoggedIn, catchAsync(transactions.renderNewTransactionForm))

router.route('/:id/edit')
    .get(isLoggedIn, catchAsync(transactions.renderEditForm))

router.route('/:id')
    .get(isLoggedIn, catchAsync(transactions.showTransaction))
    .put(isLoggedIn, validateTransaction, catchAsync(transactions.updateTransaction))
    .delete(isLoggedIn, catchAsync(transactions.deleteTransaction))

module.exports = router;