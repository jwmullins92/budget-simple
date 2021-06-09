const mongoose = require('mongoose')
const Schema = mongoose.Schema

const breakdownSchema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    amount: Number,
})

const budgetSchema = new Schema({
    amount: Number,
    month: {
        type: Date,
        required: true
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    categories: [breakdownSchema],
    transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }]
})

const Budget = mongoose.model('Budget', budgetSchema)

module.exports = Budget