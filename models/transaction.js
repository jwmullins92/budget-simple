const mongoose = require('mongoose')
const Schema = mongoose.Schema

const transactionSchema = new Schema({
    category: String,
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