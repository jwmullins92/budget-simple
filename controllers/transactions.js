const Category = require('../models/category')
const Transaction = require('../models/transaction')
const Budget = require('../models/budget')
const { filterTransactions } = require('../utils/transactionHelpers')
const moment = require('moment');
moment().format();

module.exports.index = async (req, res) => {
    req.session.returnTo = req.originalUrl // returns to current URL after editing transactions to give the filters persistence
    const originalUrl = req.originalUrl
    let transactions = await Transaction.find({ user: req.user })
    let today = new Date()
    let pageNums = Math.ceil(transactions.length / 10)
    if (req.query.limit) {
        const query = req.query
        if (!query.page) {
            query.page = 1
        }
        console.log(query)
        const results = await filterTransactions(query, transactions, pageNums, originalUrl)// filters results based on selected parameters
        return res.render('transactions/index', results)
    }
    const query = ''
    const categories = await Category.find({ user: req.user })
    transactions = await Transaction.find({ user: req.user }).populate('user').populate('category').sort({ date: -1 }).limit(10) // sorts transactions by date and defaults to show 10 per page
    const page = 1
    res.render('transactions/index', { transactions, categories, pageNums, page, query, today, originalUrl })
}

module.exports.createTransaction = async (req, res) => {
    req.body.transaction.date = moment(req.body.transaction.date);  // corrects the date to the users timezone (prevents error that sometimes sets date 1 day earlier than expected)
    const transaction = new Transaction(req.body.transaction)
    transaction.user = req.user._id;
    let budget = await Budget.find({ user: req.user })
    budget = budget.filter(b => b.month.getMonth() === transaction.date.getMonth()) // checks if transaction date falls within an existing budget period
    if (budget.length) {                                        //
        budget = await Budget.findByIdAndUpdate(budget[0]._id)  //
        budget.transactions.push(transaction)                   // if transaction date falls within a budget period, this pushes transaction onto that budget
        await budget.save()                                     //
    }                                                           //
    await transaction.save();
    const redirectUrl = req.session.returnTo ? req.session.returnTo : '/transactions' // returns to the transactions page with the persisted filters
    req.flash('success', 'Successfully added transaction!')
    res.redirect(redirectUrl)
}

module.exports.updateTransaction = async (req, res) => {
    req.body.transaction.date = moment(req.body.transaction.date); // corrects the date to the users timezone (prevents error that sometimes sets date 1 day earlier than expected)
    const { id } = req.params;
    const transaction = await Transaction.findByIdAndUpdate(id, { ...req.body.transaction })
    if (!transaction) {
        req.flash('error', 'Transaction not found')
        return res.redirect('/transactions')
    }
    const redirectUrl = req.session.returnTo ? req.session.returnTo : '/transactions' // returns to the transactions page with the persisted filters
    res.redirect(redirectUrl)
}

module.exports.renderNewTransactionForm = async (req, res) => {
    categories = await Category.find({}).sort({ title: 1 })                                                                    //
    res.render('transactions/new', { categories })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const transaction = await Transaction.findById(id)
    if (!transaction) {
        req.flash('error', 'Transaction not found')
        return res.redirect('/transactions')
    }
    const categories = await Category.find({}).sort({ title: 1 }) // sorts categories alphabetically
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
    if (!transaction) {
        req.flash('error', 'Transaction not found')
        return res.redirect('/transactions')
    }
    const redirectUrl = req.session.returnTo ? req.session.returnTo : '/transactions'
    res.redirect(redirectUrl)
}