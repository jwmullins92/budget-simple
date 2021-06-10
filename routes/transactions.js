const express = require('express');
router = express.Router();
const { isLoggedIn } = require('../middleware')
const catchAsync = require('../utils/catchAsync')
const { validateTransaction } = require('../schemas.js')
const Category = require('../models/category')
const Transaction = require('../models/transaction')
const Budget = require('../models/budget')
const transactions = require('../controllers/transactions')
const moment = require('moment');
moment().format();

router.get('/', isLoggedIn, catchAsync(transactions.index))

router.post('/', isLoggedIn, catchAsync(transactions.createTransaction))

router.get('/new', isLoggedIn, catchAsync(transactions.renderNewTransactionForm))

router.get('/:id/edit', isLoggedIn, catchAsync(transactions.renderEditForm))

router.get('/:id', isLoggedIn, catchAsync(transactions.showTransaction))

router.put('/:id', isLoggedIn, validateTransaction, catchAsync(transactions.updateTransaction))

router.delete('/:id', isLoggedIn, catchAsync(transactions.deleteTransaction))

module.exports = router;