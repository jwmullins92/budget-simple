const Budget = require('../models/budget')
const Transaction = require('../models/transaction')
const Category = require('../models/category')
const numSuffix = require('../utils/numSuffix')

module.exports.index = async (req, res) => {
    const budgets = await Budget.find({ user: req.user }).sort({ month: -1 })
    res.render('budgets/index', { budgets })
}

module.exports.createBudget = async (req, res) => {
    const { month, year } = req.body
    const budget = new Budget(req.body)
    budget.month = `${year}-${month}`
    budget.user = req.user
    let transactions = await Transaction.find({ user: req.user })
    for (let t of transactions) {
        budget.transactions.push(t)
    }
    await budget.save()
    req.flash('success', 'Successfully created new budget!')
    res.redirect('/budgets')
}

module.exports.renderNewBudgetForm = async (req, res) => {
    const date = new Date()
    const categories = await Category.find({ user: req.user }).sort({ title: 1 })
    res.render('budgets/new', { date, categories })
}

module.exports.showBudget = async (req, res) => {
    const { id } = req.params
    const budget = await Budget.findById(id).populate('categories.category')
    budget.categories.sort((a, b) => {
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
    const date = new Date()
    const { id } = req.params
    const categories = await Category.find({ user: req.user })
    const budget = await Budget.findById(id).populate('categories.category').populate('categories.category')
    budget.categories.sort((a, b) => {
        if (a.category.title < b.category.title) { return -1 };
        if (a.category.title > b.category.title) { return 1 };
        return 0
    })
    res.render(`budgets/edit`, { budget, date, categories })
}

module.exports.updateBudget = async (req, res) => {
    const { id } = req.params
    const { month, year } = req.body
    const oldBudget = await Budget.findOneAndDelete(id)
    const budget = new Budget(req.body)
    budget.month = `${year}-${month}`
    budget.user = req.user
    let transactions = await Transaction.find({ user: req.user }).sort({ date: -1 })
    for (let t of transactions) {
        budget.transactions.push(t)
    }
    await budget.save()
    res.redirect(`/budgets/${budget._id}`)
}

module.exports.showFixed = async (req, res) => {
    const { id } = req.params;
    const budget = await Budget.findById(id).populate('categories.category')
    budget.categories = budget.categories.sort((a, b) => a.category.payDate - b.category.payDate)
    budget.categories.sort((a, b) => {
        if (a.category.title < b.category.title) { return -1 };
        if (a.category.title > b.category.title) { return 1 };
        return 0
    })
    for (let c of budget.categories) {
        c.category.payDate = numSuffix(c.category.payDate)
    }
    res.render('budgets/fixed', { budget })
}

module.exports.showFlex = async (req, res) => {
    const { id } = req.params;
    const budget = await Budget.findById(id).populate('categories.category')
    budget.categories.sort((a, b) => {
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
    let redirectUrl
    if (req.body.isFixed) {
        redirectUrl = `/budgets/${id}/fixed`
    } else {
        redirectUrl = `/budgets/${id}/flex`
    }
    req.flash('success', 'Budget updated!')
    res.redirect(redirectUrl)

}

module.exports.deleteBudget = async (req, res) => {
    const { id } = req.params
    const budget = await Budget.findByIdAndDelete(id)
    res.redirect('/budgets')
}