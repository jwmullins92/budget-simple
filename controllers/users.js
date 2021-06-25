const passport = require('passport');
const User = require('../models/user')

module.exports.renderHomePage = (req, res) => {
    res.redirect('/dashboard')
}

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

module.exports.renderVerifyEmail = async (req, res) => { // First step in password reset. User must enter email.
    res.render('users/verifyEmail')
}

module.exports.verifyEmail = async (req, res) => {  // checks to see if email belongs to a user in the database and saves it to the session
    const { email } = req.body
    const user = await User.find({ email })
    if (!user.length) {
        req.flash('error', 'Could not find user...')
        return res.redirect('/reset-password/verify-email')
    }
    req.session.userEmail = email
    res.redirect('/reset-password')
}

module.exports.renderPasswordReset = async (req, res) => { // Renders password reset page
    res.render('users/resetPassword')
}

module.exports.resetPassword = async (req, res) => {  // resets password if re-entered email matches what is stored in the session
    const { email, password } = req.body
    await User.findOne({ email })
        .then((user) => {
            if (email === req.session.userEmail) {
                user.setPassword(password, (err, user) => {
                    if (err) {
                        req.flash('error', err)
                        return res.redirect('/rest-password')
                    } else {
                        user.save()
                        delete req.session.userEmail    // removes email that is stored on the session
                        req.flash("success", "Successfully reset password")
                        res.redirect('/login')
                    }
                })
            } else {
                req.flash('error', 'Could not verify user')
                res.redirect('/reset-password')
            }
        })
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!')
    res.redirect('/login')
}