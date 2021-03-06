const mongoose = require('mongoose')
const Schema = mongoose.Schema


// stores a transaction
const transactionSchema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    date: Date,
    isFixed: {
        type: Boolean,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    note: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
})

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction