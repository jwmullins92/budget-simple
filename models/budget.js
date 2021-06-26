const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Nested schema on budgetSchema. Stores how much is budgeted toward each category
const breakdownSchema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    amount: Number,
})


// Stores budgets
const budgetSchema = new Schema({
    amount: Number,
    month: {
        type: Date,
        required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    categories: [breakdownSchema],      // Referenced aboce
    transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }]
})

const Budget = mongoose.model('Budget', budgetSchema)

module.exports = Budget