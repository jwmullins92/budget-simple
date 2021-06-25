const Budget = require('../models/budget')


// When a new category is created, this pushes a reference to it on existing budgets with a default budgeted amount of $0 so it will not mess up historic budgets
module.exports.updateBudgets = async (category, user) => {
    const budgets = await Budget.find({ user })
    let newCat = {}
    newCat.category = category._id
    newCat.amount = 0
    for (let b of budgets) {
        b.categories.push(newCat)
        await b.save()
    }
}