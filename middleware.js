module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in');
        return res.redirect('/login')
    }
    next()
}

module.exports.budgetCat = (req, res, next) => {
    if (req.body.categories) {
        let arr = []
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
    } else {
        next()
    }
}