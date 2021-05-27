const mongoose = require('mongoose')
const Schema = mongoose.Schema

const transactionSchema = new Schema({
    category: String,
    date: Date,
    amount: {
        type: Number,
        required: true
    },
    note: String
})

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction