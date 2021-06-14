const Joi = require('joi')
const AppError = require('./utils/AppError')

module.exports.validateTransaction = (req, res, next) => {
    const transactionSchema = Joi.object({
        transaction: Joi.object({
            category: Joi.string().required(),
            date: Joi.date().required(),
            amount: Joi.number().min(0).required(),
            note: Joi.string().allow(''),
            isFixed: Joi.boolean()
        }).required()
    })
    const { error } = transactionSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(400, msg)
    } else {
        next()
    }
}

module.exports.validateCategory = (req, res, next) => {
    const categorySchema = Joi.object({
        category: Joi.object({
            title: Joi.string().required(),
            fixed: Joi.boolean().required(),
            amount: Joi.number().min(0),
            canEnd: Joi.boolean(),
            payDate: Joi.string()
        }).required()
    })
    const { error } = categorySchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(400, msg)
    } else {
        next()
    }
}
