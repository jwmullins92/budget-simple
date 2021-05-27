const express = require('express')
const methodOverride = require('method-override')
const app = express()
const path = require('path')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const Category = require('./models/category')
const Transaction = require('./models/transaction')
const totaler = require('./utils/budgetTotal')
const moment = require('moment');
moment().format();

mongoose.connect('mongodb://localhost:27017/budgetsimple', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected!')
});

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/dashboard', async (req, res) => {
    const categories = await Category.find({})
    const transactions = await Transaction.find({})
    const expenses = totaler(categories)
    const spent = totaler(transactions)
    res.render('dash/dashboard', { categories, expenses, spent })
})

app.get('/categories', async (req, res) => {
    const categories = await Category.find({})
    console.log(req.params)
    res.render('categories/index', { categories })
})

app.post('/categories', async (req, res) => {
    const category = new Category(req.body.category)
    await category.save()
    res.redirect('/categories')
})

app.get('/categories/:id/edit', async (req, res) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    console.log(category)
    res.render('categories/edit', { category });
})

app.put('/categories/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, { ...req.body.category })
    res.redirect('/categories')
})

app.delete('/categories/:id/edit', async (req, res) => {
    const { id } = req.params
    const category = await Category.findByIdAndDelete(id)
    res.redirect('/categories')
})

app.get('/transactions', async (req, res) => {
    transactions = await Transaction.find({})
    transactions.sort((a, b) => b.date - a.date)
    res.render('transactions/index', { transactions })
})

app.post('/transactions', async (req, res) => {
    req.body.transaction.date = moment(req.body.transaction.date);
    const transaction = new Transaction(req.body.transaction)
    await transaction.save();
    res.redirect('/transactions')
})

app.get('/transactions/new', async (req, res) => {
    categories = await Category.find({})
    res.render('transactions/new', { categories })
})

app.get('/transactions/:id/edit', async (req, res) => {
    const { id } = req.params;
    const transaction = await Transaction.findById(id)
    const categories = await Category.find({})
    res.render(`transactions/edit`, { transaction, categories })

})

app.get('/transactions/:id', async (req, res) => {
    const { id } = req.params;
    const transaction = await Transaction.findById(id)
    res.render('transactions/show', { transaction })
})

app.put('/transactions/:id', async (req, res) => {
    req.body.transaction.date = moment(req.body.transaction.date);
    const { id } = req.params;
    const transaction = await Transaction.findByIdAndUpdate(id, { ...req.body.transaction })
    res.redirect('/transactions')
})

app.delete('/transactions/:id', async (req, res) => {
    const { id } = req.params;
    const transaction = await Transaction.findByIdAndDelete(id)
    res.redirect('/transactions')
})

app.listen(3000, () => {
    console.log("On 3000!")
})