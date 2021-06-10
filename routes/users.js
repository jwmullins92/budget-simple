const express = require('express');
router = express.Router();
const catchAsync = require('../utils/catchAsync')
const passport = require('passport');
const users = require('../controllers/users')

router.get('/login', users.renderLogin)

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login' }), users.login)

router.get('/register', users.renderRegister)

router.post('/register', catchAsync(users.createNewUser))

router.get('/logout', users.logout)

module.exports = router