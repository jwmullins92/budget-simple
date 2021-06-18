const Category = require('../models/category')
const Transaction = require('../models/transaction')

module.exports.filterTransactions = async (query, transactions, pageNums, res) => {
    today = new Date()
    const { category, date, limit, page, year } = query
    pageNums = Math.ceil(transactions.length / limit)
    let skip = (page - 1) * limit
    if (date && category) {
        if (date < 12) {
            transactions = await Transaction.find({ date: { $gte: `${year}-${date}`, $lt: `${year}-${parseInt(date) + 1}` }, category })
            pageNums = Math.ceil(transactions.length / limit)
            transactions = await Transaction.find({ date: { $gte: `${year}-${date}`, $lt: `${year}-${parseInt(date) + 1}` }, category })
                .populate('user')
                .populate('category')
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ date: -1 })
        } else {
            transactions = await Transaction.find({ date: { $gte: `${year}-${date}`, $lte: `${year}-${date}-31` }, category })
            pageNums = Math.ceil(transactions.length / limit)
            transactions = await Transaction.find({ date: { $gte: `${year}-${date}`, $lte: `${year}-${date}-31` }, category })
                .populate('user')
                .populate('category')
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ date: -1 })
        }

    } else if (date && !category) {
        console.log('d no c')
        if (date < 12) {
            transactions = await Transaction.find({ date: { $gte: `${year}-${date}`, $lt: `${year}-${parseInt(date) + 1}` } })
            pageNums = Math.ceil(transactions.length / limit)
            transactions = await Transaction.find({ date: { $gte: `${year}-${date}`, $lt: `${year}-${parseInt(date) + 1}` } })
                .populate('user')
                .populate('category')
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ date: -1 })
        } else {
            transactions = await Transaction.find({ date: { $gte: `${year}-${date}`, $lte: `${year}-${date}-31` } })
            pageNums = Math.ceil(transactions.length / limit)
            transactions = await Transaction.find({ date: { $gte: `${year}-${date}`, $lte: `${year}-${date}-31` } })
                .populate('user')
                .populate('category')
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ date: -1 })
        }
    } else if (year && category && !date) {
        console.log("IN HERE")
        transactions = await Transaction.find({ date: { $gte: `${year}`, $lt: `${parseInt(year) + 1}` }, category })
        pageNums = Math.ceil(transactions.length / limit)
        transactions = await Transaction.find({ date: { $gte: `${year}`, $lt: `${parseInt(year) + 1}` }, category })
            .populate('user')
            .populate('category')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ date: -1 })
    } else if (year && !date) {
        transactions = await Transaction.find({ date: { $gte: `${year}`, $lt: `${parseInt(year) + 1}` } })
        pageNums = Math.ceil(transactions.length / limit)
        transactions = await Transaction.find({ date: { $gte: `${year}`, $lt: `${parseInt(year) + 1}` } })
            .populate('user')
            .populate('category')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ date: -1 })
    } else {
        transactions = await Transaction.find({})
            .populate('user')
            .populate('category')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ date: -1 })
    }
    const categories = await Category.find({})
    const results = { transactions, categories, pageNums, page, query }
    return results
}