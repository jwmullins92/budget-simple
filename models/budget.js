const mongoose = require('mongoose')
const Schema = mongoose.Schema

const breakdownSchema = new Schema({    // Nested schema on budgetSchema. Stores how much is budgeted toward each category
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    amount: Number,
})

const budgetSchema = new Schema({       // Stores budgets
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