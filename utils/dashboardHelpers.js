// Finds either the budget period that matches the current date, or if there is none, finds budget with the latest date.
// Also filters by query string
module.exports.filterBudget = (budget, budgetPeriod, date) => {
    if (budgetPeriod.month) {
        newBudget = budget.filter(b => parseInt(b.month.getMonth()) === parseInt(budgetPeriod.month) && parseInt(b.month.getFullYear()) === parseInt(budgetPeriod.year))
        budget = newBudget[0]
        budget.categories.sort((a, b) => {
            if (a.category.title < b.category.title) { return -1 };
            if (a.category.title > b.category.title) { return 1 };
            return 0
        })
    } else {
        newBudget = budget.filter(b => b.month.getMonth() === date.getMonth())
        if (!newBudget.length) {
            budget = budget[budget.length - 1]
        } else {
            budget = newBudget[0]
        }
        budget.categories.sort((a, b) => {
            if (a.category.title < b.category.title) { return -1 };
            if (a.category.title > b.category.title) { return 1 };
            return 0
        })
    }
    return budget
}


// Calculates total of all transactions for the budget period
module.exports.findSpent = (transactions) => {
    total = 0
    for (let t of transactions) {
        total = total + t.amount
    }
    return total
}


// Finds total of budgeted amounts
module.exports.findExpenses = (categories) => {
    let total = 0
    for (let obj of categories) {
        total = total + obj.amount
    }
    return total
}


// Finds total of budgeted amounts for fixed categories
module.exports.findFixed = (categories) => {
    total = 0
    for (let obj of categories) {
        if (obj.category.fixed === true) {
            total = total + obj.amount
        }
    }
    return total
}


// Finds total of budgeted amounts for flex categories
module.exports.findFlex = (categories) => {
    total = 0
    for (let obj of categories) {
        if (obj.category.fixed !== true) {
            total = total + obj.amount
        }
    }
    return total
}


// Tracks percent of progress for each category toward the budget cap (used to fill progress bar dynamically)
module.exports.findProgress = (budget, transactions) => {
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
    return progress
}


// reference for categories that have transactions associated with them so they are displayed correctly on the dashboard
module.exports.findProgressCategories = (progress) => {
    progressCategories = []
    for (let p of progress.categories) {
        progressCategories.push(p.category)
    }
    return progressCategories
}


// Finds how much is still scheduled out for fixed categories
module.exports.fixedRem = (budget, transactions) => {
    fixed = []
    for (let b of budget.categories) {
        if (b.category.fixed) {
            fixed.push({ category: b.category, amount: b.amount })
        }
    }
    for (let f of fixed) {
        for (let t of transactions) {
            if (f.category._id.toString() === t.category._id.toString()) {
                f.amount = f.amount - t.amount
                if (f.amount < 0) {
                    f.amount = 0
                }
            }
        }
    }
    fixedRem = 0
    for (let f of fixed) {
        fixedRem = fixedRem + f.amount
    }
    return fixedRem
}

// Finds how much is still scheduled out for flex categories
module.exports.flexRem = (budget, transactions) => {
    flex = []
    for (let b of budget.categories) {
        if (!b.category.fixed) {
            flex.push({ category: b.category, amount: b.amount })
        }
    }
    for (let f of flex) {
        for (let t of transactions) {
            if (f.category._id.toString() === t.category._id.toString()) {
                f.amount = f.amount - t.amount
                if (f.amount < 0) {
                    f.amount = 0
                }
            }
        }
    }
    flexRem = 0
    for (let f of flex) {
        flexRem = flexRem + f.amount
    }
    return flexRem
}


// Stores category ids that have transactions associated with them to identify which to render on spending tracker table
module.exports.findSpentCategories = (budget, transactions) => {
    categories = []
    spentCategories = []
    let total
    for (let b of budget.categories) {
        categories.push({ category: b.category, amount: b.amount })
    }
    for (let c of categories) {
        total = 0
        for (let t of transactions) {
            if (c.category._id.toString() === t.category._id.toString()) {
                c.amount = total + t.amount
            }
        }
        if (c.amount > 0) {
            spentCategories.push(c.category._id)
        }
    }
    return spentCategories
}