const Budget = require('../models/budget')
const Transaction = require('../models/transaction')
const Category = require('../models/category')
const numSuffix = require('../utils/numSuffix')

module.exports.index = async (req, res) => {
    const budgets = await Budget.find({ user: req.user }).sort({ month: -1 }) //sorts budgets by date (newest to oldest)
    res.render('budgets/index', { budgets })
}

module.exports.createBudget = async (req, res) => {
    const { month, year } = req.body
    const budget = new Budget(req.body)
    budget.month = new Date(year, month - 1) // creates full date format to create ISO date in budget model
    budget.user = req.user
    const transactions = await Transaction.find({ user: req.user })
    for (let t of transactions) {   // if any transactions were logged before the budget period was created, this pushes them onto the budget
        budget.transactions.push(t)
    }
    await budget.save()
    req.flash('success', 'Successfully created new budget!')
    res.redirect('/budgets')
}

module.exports.renderNewBudgetForm = async (req, res) => {
    const date = new Date()
    const categories = await Category.find({ user: req.user }).sort({ title: 1 }) // sorts categories alphabetically
    res.render('budgets/new', { date, categories }) // date is passed so the new budget form defaults to the current date
}

module.exports.showBudget = async (req, res) => {
    const { id } = req.params
    const budget = await Budget.findById(id).populate('categories.category')
    budget.categories.sort((a, b) => {                          // sorts budget categories alphabetically
        if (a.category.title < b.category.title) { return -1 };
        if (a.category.title > b.category.title) { return 1 };
        return 0
    })
    if (!budget) {
        req.flash('error', 'Budget not found')
        return res.redirect('/budgets')
    }
    res.render(`budgets/show`, { budget })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const categories = await Category.find({ user: req.user })
    const budget = await Budget.findById(id).populate('categories.category').populate('categories.category')
    budget.categories.sort((a, b) => {                          // sorts budget categories alphabetically
        if (a.category.title < b.category.title) { return -1 };
        if (a.category.title > b.category.title) { return 1 };
        return 0
    })
    res.render(`budgets/edit`, { budget, categories })
}

module.exports.updateBudget = async (req, res) => {
    const { id } = req.params
    const { month, year } = req.body
    const oldBudget = await Budget.findByIdAndDelete(id) // deletes current budget
    const budget = new Budget(req.body)                  // replaces current budget with updated information
    budget.month = new Date(year, month - 1)            // creates full date format to create ISO date in budget model
    budget.user = req.user
    let transactions = await Transaction.find({ user: req.user }).sort({ date: -1 })    // pushes existing transactions that match budget period onto budget
    for (let t of transactions) {
        budget.transactions.push(t)
    }
    await budget.save()
    console.log(budget._id)
    res.redirect(`/budgets/${budget._id}`)
}

module.exports.showFixed = async (req, res) => {
    req.session.returnTo = req.originalUrl      // will redirect back to this URL if edits are made on-page
    const { id } = req.params;
    const budget = await Budget.findById(id).populate('categories.category')
    const newArr = budget.categories.filter(c => c.category.payDate).sort((a, b) => a.category.payDate - b.category.payDate)    //
    budget.categories = budget.categories.filter(c => !c.category.payDate)                                                      // sorts budget.categories by due date of the fixed category
    budget.categories = budget.categories.push(...newArr)                                                                       //
    for (let c of budget.categories) {
        c.category.payDate = numSuffix(c.category.payDate) // adds the appropriate suffix to the date (i.e. 1st, 11th, 22nd etc)
    }
    res.render('budgets/fixed', { budget })
}

module.exports.showFlex = async (req, res) => {
    req.session.returnTo = req.originalUrl  // will redirect back to this URL if edits are made on-page
    const { id } = req.params;
    const budget = await Budget.findById(id).populate('categories.category')
    budget.categories.sort((a, b) => {                          // sorts alphabetically
        if (a.category.title < b.category.title) { return -1 };
        if (a.category.title > b.category.title) { return 1 };
        return 0
    })
    res.render('budgets/flexible', { budget })
}

module.exports.updateBudgetItem = async (req, res) => {
    const { id } = req.params
    const budget = await Budget.findByIdAndUpdate(id, { ...req.body })
    await budget.save()
    let redirectUrl = req.session.returnTo // redirects back to showFixed or showFlex, depending on where you came from
    req.flash('success', 'Budget updated!')
    res.redirect(redirectUrl)

}

module.exports.deleteBudget = async (req, res) => {
    const { id } = req.params
    const budget = await Budget.findByIdAndDelete(id)
    res.redirect('/budgets')
}