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
const transactionRoutes = require('./routes/transactions')
const dashRoutes = require('./routes/dashboard')
const categoryRoutes = require('./routes/categories')
const budgetRoutes = require('./routes/budgets')
const userRoutes = require('./routes/users')
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

app.use('/dashboard', dashRoutes)
app.use('/categories', categoryRoutes)
app.use('/transactions', transactionRoutes);
app.use('/budgets', budgetRoutes)
app.use('/', userRoutes)

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