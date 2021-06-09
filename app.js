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
const Budget = require('./models/budget')
const { isLoggedIn, budgetCat } = require('./middleware')
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
    res.locals.months = months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next()
})

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/dashboard', isLoggedIn, catchAsync(async (req, res) => {
    const date = new Date()
    const categories = await Category.find({ user: req.user })
    let transactions = await Transaction.find({ user: req.user }).populate('category')
    let budget = await Budget.find({ user: req.user }).populate('categories.category').populate('transactions')
    if (!budget.length) {
        return res.render('dash/dashboard', { categories, date, budget, transactions })
    }
    budget = budget.filter(b => b.month.getMonth() === date.getMonth())
    budget = budget[0]
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
                    newObj.percent = percent
                    newObj.spent = t.amount
                    progress.categories.push(newObj)

                }
            }
        }
    }
    fixedTotal = fixedTotal - fixedTr
    flexTotal = flexTotal - flexTr
    res.render('dash/dashboard', { categories, date, budget, transactions, expenses, spent, fixedTotal, flexTotal, progress })
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
    category.user = req.user._id
    await category.save()
    req.flash('success', 'Successfully created new category!')
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

app.delete('/categories/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params
    const category = await Category.findByIdAndDelete(id)
    res.redirect('/categories')
}))

app.get('/transactions', isLoggedIn, catchAsync(async (req, res) => {
    const categories = await Category.find({})
    let transactions = await Transaction.find({}).populate('user').populate('category')
    categories.sort(function (a, b) {
        if (a.title.toLowerCase() < b.title.toLowerCase()) { return -1; }
        if (a.title.toLowerCase() > b.title.toLowerCase()) { return 1; }
        return 0;
    })
    transactions = transactions.sort((a, b) => b.date - a.date)
    res.render('transactions/index', { transactions, categories })
}))

app.post('/transactions', isLoggedIn, catchAsync(async (req, res) => {
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

app.get('/budgets', isLoggedIn, catchAsync(async (req, res) => {
    const budgets = await Budget.find({ user: req.user })
    console.log('index page budget*****', budgets)
    res.render('budgets/index', { budgets })
}))

app.post('/budgets', budgetCat, isLoggedIn, catchAsync(async (req, res) => {
    const { month, year } = req.body
    const budget = new Budget(req.body)
    budget.month = `${year}-${month}`
    budget.user = req.user
    let transactions = await Transaction.find({ user: req.user })
    transactions = transactions.filter(t => t.date.getMonth() === budget.month.getMonth())
    for (let t of transactions) {
        budget.transactions.push(t)
    }
    await budget.save()
    req.flash('success', 'Successfully created new budget!')
    res.redirect('/budgets')
}))

app.get('/budgets/new', isLoggedIn, catchAsync(async (req, res) => {
    const date = new Date()
    const categories = await Category.find({ user: req.user })
    res.render('budgets/new', { date, categories })
}))

app.get('/budgets/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params
    const budget = await Budget.findById(id).populate('categories.category')
    if (!budget) {
        req.flash('error', 'Budget not found')
        return res.redirect('/budgets')
    }
    res.render(`budgets/show`, { budget })
}))

app.get('/budgets/:id/edit', catchAsync(async (req, res) => {
    const date = new Date()
    const { id } = req.params
    const budget = await Budget.findById(id).populate('categories.category').populate('categories.category')
    console.log('Edit page budget*****', budget)
    res.render('budgets/edit', { budget, date })
}))

app.post('/budgets/:id', budgetCat, catchAsync(async (req, res) => {
    const { id } = req.params
    const { month, year } = req.body
    const oldBudget = await Budget.findOneAndDelete(id)
    const budget = new Budget(req.body)
    budget.month = `${year}-${month}`
    budget.user = req.user
    let transactions = await Transaction.find({ user: req.user })
    transactions = transactions.filter(t => t.date.getMonth() === budget.month.getMonth())
    for (let t of transactions) {
        budget.transactions.push(t)
    }
    await budget.save()
    res.redirect(`/budgets/${budget._id}`)
}))

app.delete('/budgets/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params
    const budget = await Budget.findByIdAndDelete(id)
    res.redirect('/budgets')
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