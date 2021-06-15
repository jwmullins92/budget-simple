const Category = require('../models/category')
const Transaction = require('../models/transaction')
const Budget = require('../models/budget')
const moment = require('moment');
moment().format();

module.exports.index = async (req, res) => {
    req.session.returnTo = req.originalUrl
    console.log(req.session)
    let transactions = await Transaction.find({})
    let today = new Date()
    let pageNums = Math.ceil(transactions.length / 10)
    if (req.query.limit) {
        const query = req.query
        const { category, date, limit, page, year } = req.query
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
        categories.sort(function (a, b) {
            if (a.title.toLowerCase() < b.title.toLowerCase()) { return -1; }
            if (a.title.toLowerCase() > b.title.toLowerCase()) { return 1; }
            return 0;
        })
        return res.render('transactions/index', { transactions, categories, pageNums, page, query, today })
    }
    let query = ''
    const categories = await Category.find({})
    transactions = await Transaction.find({}).populate('user').populate('category').sort({ date: -1 }).limit(10)
    const page = 1
    categories.sort(function (a, b) {
        if (a.title.toLowerCase() < b.title.toLowerCase()) { return -1; }
        if (a.title.toLowerCase() > b.title.toLowerCase()) { return 1; }
        return 0;
    })
    res.render('transactions/index', { transactions, categories, pageNums, page, query, today })
}

module.exports.createTransaction = async (req, res) => {
    req.body.transaction.date = moment(req.body.transaction.date);
    const transaction = new Transaction(req.body.transaction)
    transaction.user = req.user._id;
    let budget = await Budget.find({ user: req.user })
    budget = budget.filter(b => b.month.getMonth() === transaction.date.getMonth())
    if (budget.length) {
        budget = await Budget.findByIdAndUpdate(budget[0]._id)
        budget.transactions.push(transaction)
        await budget.save()
    }
    await transaction.save();
    const redirectUrl = req.session.returnTo ? req.session.returnTo : '/transactions'
    req.flash('success', 'Successfully added transaction!')
    res.redirect(redirectUrl)
}

module.exports.updateTransaction = async (req, res) => {
    req.body.transaction.date = moment(req.body.transaction.date);
    const { id } = req.params;
    const transaction = await Transaction.findByIdAndUpdate(id, { ...req.body.transaction })
    const redirectUrl = req.session.returnTo ? req.session.returnTo : '/transactions'
    res.redirect(redirectUrl)
}

module.exports.renderNewTransactionForm = async (req, res) => {

    categories = await Category.find({})
    categories.sort(function (a, b) {
        if (a.title.toLowerCase() < b.title.toLowerCase()) { return -1; }
        if (a.title.toLowerCase() > b.title.toLowerCase()) { return 1; }
        return 0;
    })
    res.render('transactions/new', { categories })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const transaction = await Transaction.findById(id)
    if (!transaction) {
        req.flash('error', 'Transaction not found')
        return res.redirect('/transactions')
    }
    const categories = await Category.find({}).sort({ title: 1 })
    res.render(`transactions/edit`, { transaction, categories })
}

module.exports.showTransaction = async (req, res) => {
    const { id } = req.params;
    const transaction = await Transaction.findById(id).populate('category')
    if (!transaction) {
        req.flash('error', 'Transaction not found')
        return res.redirect('/transactions')
    }
    res.render('transactions/show', { transaction })
}

module.exports.deleteTransaction = async (req, res) => {
    const { id } = req.params;
    const transaction = await Transaction.findByIdAndDelete(id)
    res.redirect('/transactions')
}