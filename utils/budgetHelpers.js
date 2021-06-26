// Calculates remaining money budgeted for fixed category (can be negative)
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
            }
        }
    }
    return fixed
}


// Calculates remaining money budgeted for fixed category (can be negative)
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
            }
        }
    }
    return flex
}