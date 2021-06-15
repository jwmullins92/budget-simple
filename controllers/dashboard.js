const Transaction = require('../models/transaction')
const Budget = require('../models/budget')
const Category = require('../models/category')

module.exports.loadDashboard = async (req, res) => {
    let budgetPeriod = req.query
    const date = new Date()
    let transactions = await Transaction.find({ user: req.user }).populate('category')
    let budget = await Budget.find({ user: req.user }).populate('categories.category').populate('transactions')
    const categories = await Category.find({ user: req.user })
    if (!budget.length) {
        return res.render('dash/dashboard', { categories, date, budget, transactions })
    }
    if (budgetPeriod.month) {
        budget = budget.filter(b => parseInt(b.month.getMonth()) === parseInt(budgetPeriod.month) && parseInt(b.month.getFullYear()) === parseInt(budgetPeriod.year))
        budget = budget[0]
        budget.categories.sort((a, b) => {
            if (a.category.title < b.category.title) { return -1 };
            if (a.category.title > b.category.title) { return 1 };
            return 0
        })
        if (!budget) {
            req.flash('error', 'Could not find budget period')
            return res.redirect('/dashboard')
        }
    } else {
        budget = budget.filter(b => b.month.getMonth() === date.getMonth())
        budget = budget[0]
        budget.categories.sort((a, b) => {
            if (a.category.title < b.category.title) { return -1 };
            if (a.category.title > b.category.title) { return 1 };
            return 0
        })
    }
    transactions = transactions.filter(t => t.date.getMonth() === budget.month.getMonth())
    let spent = 0
    for (let t of transactions) {
        spent = spent + t.amount
    }
    let expenses = 0
    for (let obj of budget.categories) {
        expenses = expenses + obj.amount
    }
    let fixedTotal = 0
    let flexTotal = 0
    for (let obj of budget.categories) {
        if (obj.category.fixed === true) {
            fixedTotal = fixedTotal + obj.amount
        } else {
            flexTotal = flexTotal + obj.amount
        }
    }
    let fixedTr = 0
    let flexTr = 0
    for (let t of transactions) {
        if (t.category.fixed === true) {
            fixedTr = fixedTr + t.amount
        } else {
            flexTr = flexTr + t.amount
        }
    }
    let progress = {}
    progress.categories = []
    for (let b of budget.categories) {
        for (let t of transactions) {
            if (b.category.title === t.category.title) {
                let newObj = {}
                newObj.category = t.category.title
                if (progress.categories.length) {
                    for (let c of progress.categories) {
                        if (c.category === newObj.category) {
                            newObj.percent = c.percent
                            newObj.spent = c.spent
                            progress.categories.splice(progress.categories.indexOf(c, 1))
                        }
                    }
                }
                let diff = b.amount - t.amount
                let divisor = b.amount - diff
                let percent = divisor / b.amount * 100
                if (newObj.percent) {
                    newObj.percent = newObj.percent + percent
                    newObj.spent = newObj.spent + t.amount
                    newObj.percent = Math.round(newObj.percent)
                    progress.categories.push(newObj)
                } else {
                    newObj.percent = Math.round(percent)
                    newObj.spent = t.amount
                    progress.categories.push(newObj)

                }
            }
        }
    }
    fixedTotal = fixedTotal - fixedTr
    flexTotal = flexTotal - flexTr
    res.render('dash/dashboard', { categories, date, budget, transactions, expenses, spent, fixedTotal, flexTotal, progress, budgetPeriod })
}