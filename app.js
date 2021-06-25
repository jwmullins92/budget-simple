if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// Requires Express
const express = require('express')
const app = express()

// Allows for changing POST routes into PUT, PATCH, DELETE, etc.
const methodOverride = require('method-override')
const path = require('path')

// Allows for simple breaking into partials with EJS
const ejsMate = require('ejs-mate')

// Allows sessions
const session = require('express-session')
const MongoStore = require('connect-mongo');

// Allows for flash messages
const flash = require('connect-flash')

// Allows for custom error handling
const AppError = require('./utils/AppError')

// Requires mongoose
const mongoose = require('mongoose')

// Requires the User model
const User = require('./models/user')

// Allows for simpler building of authentication
const passport = require('passport')
const LocalStrategy = require('passport-local')
// 

// Basic mongo security to prevent query injection
const mongoSanitize = require('express-mongo-sanitize')

// More security
const helmet = require('helmet')

// Imports routing from routes folder
const transactionRoutes = require('./routes/transactions')
const dashRoutes = require('./routes/dashboard')
const categoryRoutes = require('./routes/categories')
const budgetRoutes = require('./routes/budgets')
const userRoutes = require('./routes/users')
// 

// Database connection and confirmation
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/budgetsimple'
mongoose.connect(dbUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected!')
});
// 

// Allows for EJS functionality
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// 


// Customizes and configures the session

const secret = process.env.SECRET || "developmentBackupSecretCode"

const sessionConfig = {
    name: 'budgetSession',
    secret,
    store: MongoStore.create({
        mongoUrl: dbUrl,
        secret,
        touchAfter: 24 * 3600
    }),
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}


// 


app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// Access public folder from anywhere
app.use(express.static(path.join(__dirname, 'public')));

// Initializes session and flash
app.use(session(sessionConfig))
app.use(flash())
// 

// Initializes and sets up passport authentication
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// 

// Sanitizes queries
app.use(mongoSanitize())

// Additional security
app.use(helmet())


const scriptSrcUrls = [
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net/",
];
const connectSrcUrls = [];
const fontSrcUrls = [
    "https://cdn.jsdelivr.net/"
];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://cdn.pixabay.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// Globally accessible data
app.use((req, res, next) => {
    res.locals.months = months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next()
})
// 

// Route handlers
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
// 

// Starts server

port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})
//