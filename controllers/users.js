const passport = require('passport');
const User = require('../models/user')

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!')
    const redirectUrl = req.session.returnTo || '/dashboard'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.createNewUser = async (req, res) => {
    try {
        const { username, password, email } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, (err) => {
            if (err) {
                return next
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