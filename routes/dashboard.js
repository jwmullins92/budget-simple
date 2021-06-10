
const express = require('express');
router = express.Router();
const { isLoggedIn } = require('../middleware')
const catchAsync = require('../utils/catchAsync')
const Transaction = require('../models/transaction')
const Budget = require('../models/budget')
const Category = require('../models/category')
const dashboard = require('../controllers/dashboard')


router.get('/', isLoggedIn, catchAsync(dashboard.loadDashboard))

module.exports = router