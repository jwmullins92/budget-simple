const Category = require('../models/category')
const Transaction = require('../models/transaction')
const Budget = require('../models/budget')
const moment = require('moment');
moment().format();

module.exports.index = async (req, res) => {
    const categories = await Category.find({})
    let transactions = await Transaction.find({}).populate('user').populate('category')
    categories.sort(function (a, b) {
        if (a.title.toLowerCase() < b.title.toLowerCase()) { return -1; }
        if (a.title.toLowerCase() > b.title.toLowerCase()) { return 1; }
        return 0;
    })
    transactions = transactions.sort((a, b) => b.date - a.date)
    res.render('transactions/index', { transactions, categories })
}

module.exports.createTransaction = async (req, res) => {
    req.body.transaction.date = moment(req.body.transaction.date);
    const transaction = new Transaction(req.body.transaction)
    transaction.user = req.user._id;
    let budget = await Budget.find({ user: req.user })
    budget = budget.filter(b => b.month.getMonth() === transaction.date.getMonth())
    budget = await Budget.findByIdAndUpdate(budget[0]._id)
    budget.transactions.push(transaction)
    await budget.save()
    await transaction.save();
    req.flash('success', 'Successfully added transaction!')
    res.redirect('/transactions')
}

module.exports.updateTransaction = async (req, res) => {
    req.body.transaction.date = moment(req.body.transaction.date);
    const { id } = req.params;
    const transaction = await Transaction.findByIdAndUpdate(id, { ...req.body.transaction })
    res.redirect('/transactions')
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
    const categories = await Category.find({})
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