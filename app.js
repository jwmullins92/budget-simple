const express = require('express')
const methodOverride = require('method-override')
const app = express()
const path = require('path')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const AppError = require('./utils/AppError')
const mongoose = require('mongoose')
const Category = require('./models/category')
const Transaction = require('./models/transaction')
const { isLoggedIn } = require('./middleware')
const User = require('./models/user')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const { validateTransaction, validateCategory } = require('./schemas.js')
const totaler = require('./utils/budgetTotal')
const catchAsync = require('./utils/catchAsync')
const moment = require('moment');
const clearQuery = require('./middleware')
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

const sessionConfig = {
    secret: 'mysecretcode',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionConfig))
app.use(flash())


app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next()
})

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/dashboard', isLoggedIn, catchAsync(async (req, res) => {
    const categories = await Category.find({})
    const transactions = await Transaction.find({})
    const expenses = totaler(categories)
    const spent = totaler(transactions)
    const date = new Date()
    moment(date)
    res.render('dash/dashboard', { categories, expenses, spent, date })
}))

app.get('/categories', isLoggedIn, catchAsync(async (req, res) => {
    const categories = await Category.find({})
    categories.sort(function (a, b) {
        if (a.title.toLowerCase() < b.title.toLowerCase()) { return -1; }
        if (a.title.toLowerCase() > b.title.toLowerCase()) { return 1; }
        return 0;
    })
    res.render('categories/index', { categories })
}))

app.post('/categories', isLoggedIn, validateCategory, catchAsync(async (req, res) => {
    const category = new Category(req.body.category)
    await category.save()
    res.redirect('/categories')
}))

app.get('/categories/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
        req.flash('error', 'Category not found')
        return res.redirect('/categories')
    }
    res.render('categories/edit', { category });
}))

app.put('/categories/:id', isLoggedIn, validateCategory, catchAsync(async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, { ...req.body.category })
    res.redirect('/categories')
}))

app.delete('/categories/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params
    const category = await Category.findByIdAndDelete(id)
    res.redirect('/categories')
}))

app.get('/transactions', isLoggedIn, catchAsync(async (req, res) => {
    const categories = await Category.find({})
    let transactions = await Transaction.find({})
    categories.sort(function (a, b) {
        if (a.title.toLowerCase() < b.title.toLowerCase()) { return -1; }
        if (a.title.toLowerCase() > b.title.toLowerCase()) { return 1; }
        return 0;
    })
    console.log(categories)
    transactions = transactions.sort((a, b) => b.date - a.date)
    res.render('transactions/index', { transactions, categories })
}))

app.post('/transactions', isLoggedIn, validateTransaction, catchAsync(async (req, res) => {
    req.body.transaction.date = moment(req.body.transaction.date);
    const transaction = new Transaction(req.body.transaction)
    await transaction.save();
    req.flash('success', 'Successfully added transaction!')
    res.redirect('/transactions')
}))

app.get('/transactions/new', isLoggedIn, catchAsync(async (req, res) => {
    categories = await Category.find({})
    categories.sort(function (a, b) {
        if (a.title.toLowerCase() < b.title.toLowerCase()) { return -1; }
        if (a.title.toLowerCase() > b.title.toLowerCase()) { return 1; }
        return 0;
    })
    res.render('transactions/new', { categories })
}))

app.get('/transactions/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const transaction = await Transaction.findById(id)
    if (!transaction) {
        req.flash('error', 'Transaction not found')
        return res.redirect('/transactions')
    }
    const categories = await Category.find({})
    res.render(`transactions/edit`, { transaction, categories })
}))

app.get('/transactions/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const transaction = await Transaction.findById(id)
    if (!transaction) {
        req.flash('error', 'Transaction not found')
        return res.redirect('/transactions')
    }
    res.render('transactions/show', { transaction })
}))

app.put('/transactions/:id', isLoggedIn, validateTransaction, catchAsync(async (req, res) => {
    req.body.transaction.date = moment(req.body.transaction.date);
    const { id } = req.params;
    const transaction = await Transaction.findByIdAndUpdate(id, { ...req.body.transaction })
    res.redirect('/transactions')
}))

app.delete('/transactions/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const transaction = await Transaction.findByIdAndDelete(id)
    res.redirect('/transactions')
}))

app.get('/login', (req, res) => {
    res.render('users/login')
})

app.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login' }), (req, res) => {
    req.flash('success', 'Welcome back!')
    res.redirect('/dashboard')
})

app.get('/register', (req, res) => {
    res.render('users/register')
})

app.post('/register', catchAsync(async (req, res) => {
    try {
        const { username, password, email } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.flash('success', 'Welcome to Budget Simple!')
        res.redirect('/dashboard')
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
    console.log(registeredUser);
}))

app.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!')
    res.redirect('/login')
})

app.all('*', (req, res, next) => {
    next(new AppError(404, 'Page Not Found'))
})

app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong.' } = err
    res.status(status).render('error', { err })
})

app.listen(3000, () => {
    console.log("On 3000!")
})