const express = require('express');
router = express.Router();
const catchAsync = require('../utils/catchAsync')
const passport = require('passport');
const users = require('../controllers/users')
const { confirmUserEmail } = require('../middleware.js')
const { validateNewUser, validateNewPassword } = require('../schemas')

// MIDDLEWARE
// confirmUserEmail = Blocks access from password reset route unless user enters an email address that is in the database
// validateNewUser = Validates new users with the User Model
// validatePassword = Validates password when changing the password

// Home page
router.route('/')
    .get(users.renderHomePage)

// login routes
router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)


// Register routes
router.route('/register')
    .get(users.renderRegister)
    .post(validateNewUser, catchAsync(users.createNewUser))

// Password reset rountes
router.route('/reset-password')
    .get(confirmUserEmail, catchAsync(users.renderPasswordReset))
    .post(validateNewPassword, catchAsync(users.resetPassword))

router.route('/reset-password/verify-email')
    .get(catchAsync(users.renderVerifyEmail))
    .post(catchAsync(users.verifyEmail))


// Logout
router.route('/logout')
    .get(users.logout)

module.exports = router