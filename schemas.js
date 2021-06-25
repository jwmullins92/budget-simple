const baseJoi = require('joi')
const sanitizeHtml = require('sanitize-html')
const passwordComplexity = require("joi-password-complexity")
const AppError = require('./utils/AppError')


// adds method to Joi validation that provides basic security against cross-site scripting
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});
//


// adds the extension to Joi
const Joi = baseJoi.extend(extension)


// Sets password parameters
const complexityOptions = {
    min: 5,
    max: 50,
    lowerCase: 1,
    numeric: 1,
    requirementCount: 2
}


// Validates nested categories model only (used when updating from fixed and flex pages)
module.exports.validateBudgetBreakdown = (req, res, next) => {
    const breakdownSchema = Joi.array()
        .items({
            category: Joi.string().required().escapeHTML(),
            amount: Joi.alternatives().try(Joi.number(), Joi.string().allow('')).required()
        })
        .required()
    if (breakdownSchema.validate(req.body.categories).error) {
        const { error } = breakdownSchema.validate(req.body.categories)
        const msg = error.details.map(el => el.message)
        throw new AppError(400, msg)
    } else {
        next()
    }
}


// Validates a new or edited budget
module.exports.validateBudget = (req, res, next) => {
    const breakdownSchema = Joi.array()
        .items({
            category: Joi.string().required().escapeHTML(),
            amount: Joi.alternatives().try(Joi.number(), Joi.string().allow('').escapeHTML()).required()
        })
        .required()
    if (breakdownSchema.validate(req.body.categories).error) {
        const { error } = breakdownSchema.validate(req.body.categories)
        const msg = error.details.map(el => el.message)
        throw new AppError(400, msg)
    }
    const budgetSchema = Joi.object({
        amount: Joi.number().min(0),
        month: Joi.number().required(),
        year: Joi.number(),
        user: Joi.string().required().escapeHTML(),
        categories: breakdownSchema,
        transactions: [Joi.string().escapeHTML()]
    }).required()
    if (budgetSchema.validate(req.body).error) {
        const { error } = budgetSchema.validate(req.body)
        const msg = error.details[0].message
        throw new AppError(400, msg)
    } else {
        next()
    }
}


// Validates a new user
module.exports.validateNewUser = (req, res, next) => {
    const userSchema = Joi.object({
        email: Joi.string().required().escapeHTML(),
        username: Joi.string().required().escapeHTML(),
        password: passwordComplexity(complexityOptions)
    }).required()
    const { error } = userSchema.validate(req.body)
    if (error) {
        const msg = error.details[0].message
        throw new AppError(400, msg)
    } else {
        next()
    }
}


// Validates password when password is reset
module.exports.validateNewPassword = (req, res, next) => {
    const password = passwordComplexity(complexityOptions)
    const { error } = password.validate(req.body.password)
    if (error) {
        const msg = error.details[0].message
        throw new AppError(400, msg)
    } else {
        next()
    }
}

// Validates new or edited transactions
module.exports.validateTransaction = (req, res, next) => {
    const transactionSchema = Joi.object({
        transaction: Joi.object({
            category: Joi.string().required().escapeHTML(),
            date: Joi.date().required(),
            amount: Joi.number().min(0).required(),
            note: Joi.string().allow('').escapeHTML(),
            isFixed: Joi.boolean()
        }).required()
    })
    const { error } = transactionSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message)
        throw new AppError(400, msg)
    } else {
        next()
    }
}


// Validates new or edited categories
module.exports.validateCategory = (req, res, next) => {
    const categorySchema = Joi.object({
        category: Joi.object({
            title: Joi.string().required().escapeHTML(),
            fixed: Joi.boolean().required(),
            amount: Joi.number().min(0),
            canEnd: Joi.boolean(),
            payDate: Joi.string().allow('').escapeHTML()
        }).required()
    })
    const { error } = categorySchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message)
        throw new AppError(400, msg)
    } else {
        next()
    }
}
