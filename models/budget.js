const mongoose = require('mongoose')
const Schema = mongoose.Schema

const breakdownSchema = new Schema({
    category: String,
    amount: Number
})

const budgetSchema = new Schema({
    amount: Number,
    month: {
        type: Date,
        required: true
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    categories: [breakdownSchema]
})

const Budget = mongoose.model('Budget', budgetSchema)

module.exports = Budget