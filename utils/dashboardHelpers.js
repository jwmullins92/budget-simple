module.exports.filterBudget = (budget, budgetPeriod, date) => {
    if (budgetPeriod.month) {
        budget = budget.filter(b => parseInt(b.month.getMonth()) === parseInt(budgetPeriod.month) && parseInt(b.month.getFullYear()) === parseInt(budgetPeriod.year))
        budget = budget[0]
        budget.categories.sort((a, b) => {
            if (a.category.title < b.category.title) { return -1 };
            if (a.category.title > b.category.title) { return 1 };
            return 0
        })
    } else {
        budget = budget.filter(b => b.month.getMonth() === date.getMonth())
        budget = budget[0]
        budget.categories.sort((a, b) => {
            if (a.category.title < b.category.title) { return -1 };
            if (a.category.title > b.category.title) { return 1 };
            return 0
        })
    }
    console.log(budget)
    return budget
}

module.exports.findSpent = (transactions) => {
    total = 0
    for (let t of transactions) {
        total = total + t.amount
    }
    return total
}

module.exports.findExpenses = (categories) => {
    let total = 0
    for (let obj of categories) {
        total = total + obj.amount
    }
    return total
}

module.exports.findFixed = (categories) => {
    total = 0
    for (let obj of categories) {
        if (obj.category.fixed === true) {
            total = total + obj.amount
        }
    }
    return total
}

module.exports.findFlex = (categories) => {
    total = 0
    for (let obj of categories) {
        if (obj.category.fixed !== true) {
            total = total + obj.amount
        }
    }
    return total
}

module.exports.findFixedTransactions = (transactions) => {
    total = 0
    for (let t of transactions) {
        if (t.category.fixed === true) {
            total = total + t.amount
        }
    }
    return total
}

module.exports.findFlexTransactions = (transactions) => {
    total = 0
    for (let t of transactions) {
        if (t.category.fixed !== true) {
            total = total + t.amount
        }
    }
    return total
}

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

module.exports.findProgressCategories = (progress) => {
    progressCategories = []
    for (let p of progress.categories) {
        progressCategories.push(p.category)
    }
    return progressCategories
}