const Transaction = require('../models/transaction')
const Budget = require('../models/budget')
const Category = require('../models/category')
const { filterBudget, findSpent, findSpentCategories, findExpenses, findFixed, findFlex, fixedRem, flexRem, findFixedTransactions, findFlexTransactions, findProgress, findProgressCategories } = require('../utils/dashboardHelpers.js')


// Loads dashboard
module.exports.loadDashboard = async (req, res) => {
    const budgetPeriod = req.query // Defines budget period from query string
    const date = new Date()
    let transactions = await Transaction.find({ user: req.user }).populate('category')
    let budget = await Budget.find({ user: req.user }).populate('categories.category').populate('transactions')
    const categories = await Category.find({ user: req.user })
    if (!budget.length) {
        return res.render('dash/dashboard', { categories, date, budget, transactions }) // renders dashboard without calculating totals if no budget
    }
    try {                                                       // filters budget based on query string
        budget = filterBudget(budget, budgetPeriod, date)       // if no query string, renders budget period that matches the current date
    } catch (e) {
        req.flash('error', 'Could not find budget period')      // redirects to current budget period if it can't find one with query parameters
        return res.redirect('/dashboard')
    }
    transactions = transactions.filter(t => t.date.getMonth() === budget.month.getMonth()) // filters out transactions taht do not match the budget period
    const spent = findSpent(transactions)                        // calculates total transactions for budget period
    const expenses = findExpenses(budget.categories)             // calculates total money assigned to a category for budget period
    let fixedTotal = findFixed(budget.categories)                // calculates how much of the assigned money is designated for a fixed expense
    let flexTotal = findFlex(budget.categories)                  // calculates how much of the assigned money is designated for a flexible expense
    const progress = findProgress(budget, transactions)          // calculates % progress spent toward cap for each category
    const progressCategories = findProgressCategories(progress)  // reference for categories that have transactions associated with them
    const fixedRemaining = fixedRem(budget, transactions)        // calculates remaining fixed expenses that are still scheduled out
    const flexRemaining = flexRem(budget, transactions)          // calculates remaining flexible expenses that are still scheduled out
    const categorySpentTracker = findSpentCategories(budget, transactions) // Stores category ids that have transactions associated with them to identify which to render on spending tracker table
    res.render('dash/dashboard', { categories, categorySpentTracker, date, budget, transactions, expenses, spent, fixedRemaining, flexRemaining, fixedTotal, flexTotal, progress, budgetPeriod, progressCategories })
}