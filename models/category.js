const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    amount: Number,
    fixed: Boolean,
    canEnd: Boolean
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category