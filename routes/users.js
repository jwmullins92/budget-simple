const express = require('express');
router = express.Router();
const catchAsync = require('../utils/catchAsync')
const passport = require('passport');
const users = require('../controllers/users')

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login' }), users.login)

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.createNewUser))

router.route('/logout')
    .get(users.logout)

module.exports = router