const passport = require('passport');
const User = require('../models/user')

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!')
    const redirectUrl = req.session.returnTo || '/dashboard' // once logged in, they are taken to where they tried to go
    delete req.session.returnTo // cleans up the session
    res.redirect(redirectUrl)
}

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.createNewUser = async (req, res) => {
    try {
        const { username, password, email } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)  // creates new user and salts password
        req.login(registeredUser, (err) => {    //
            if (err) {                          // logs in newly registered user
                return next()                   //
            }
            req.flash('success', 'Welcome to Budget Simple!')
            res.redirect('/dashboard')
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!')
    res.redirect('/login')
}