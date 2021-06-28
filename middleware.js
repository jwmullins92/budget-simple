const seedExampleUser = require('./seeds/seedExampleUser')

// Verifies user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        if (req.originalUrl !== '/dashboard') {
            req.flash('error', 'You must be signed in');
            return res.redirect('/login')
        }
        return res.redirect('/login')
    }
    next()
}

// Blocks access to password reset page unless user has entered an email that is in the database
module.exports.confirmUserEmail = (req, res, next) => {
    if (req.session.userEmail) {
        next()
    } else {
        res.redirect('/reset-password/verify-email')
    }
}

// Formats the categories with their budgeted amounts for a budget period so it will work with the Budget Model
module.exports.budgetCat = (req, res, next) => {
    req.body.user = req.user._id.toString()
    let string = 'string'
    if (req.body.categories) {
        let arr = []
        if (typeof req.body.categories.category === typeof string) {
            let { category, amount } = req.body.categories
            let newObj = {
                category,
                amount
            }
            arr.push(newObj)
            req.body.categories = arr
            next()
        } else {
            let { category, amount } = req.body.categories
            for (let i = 0; i < category.length; i++) {
                let newObj = {
                    category: category[i],
                    amount: amount[i]
                }
                arr.push(newObj)
            }
            req.body.categories = arr
            next()
        }
    } else {
        next()
    }
}

module.exports.seedExample = async (req, res, next) => {
    if (req.user._id.toString() === "60da2f71165c5b8c8167eea0") {
        await seedExampleUser(req.user)
        next()
    } else {
        next()
    }
}