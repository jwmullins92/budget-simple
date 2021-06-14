module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in');
        return res.redirect('/login')
    }
    next()
}

module.exports.budgetCat = (req, res, next) => {
    let arr = []
    const { category, amount } = req.body.categories
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