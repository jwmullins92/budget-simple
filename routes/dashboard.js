
const express = require('express');
router = express.Router();
const { isLoggedIn } = require('../middleware')
const catchAsync = require('../utils/catchAsync')
const dashboard = require('../controllers/dashboard')

// Middleware
// isLoggedIn = Verifies user is logged in

// Dashboard
router.route('/')
    .get(isLoggedIn, catchAsync(dashboard.loadDashboard))

module.exports = router