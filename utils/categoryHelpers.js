const Budget = require('../models/budget')

module.exports.updateBudgets = async (category) => {
    const budgets = await Budget.find({})
    let newCat = {}
    newCat.category = category._id
    newCat.amount = 0
    for (let b of budgets) {
        b.categories.push(newCat)
        await b.save()
    }
}