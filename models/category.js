const mongoose = require('mongoose')
const Budget = require('./budget')
const Transaction = require('./transaction')

const Schema = mongoose.Schema

const categorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    fixed: {
        type: Boolean,
        required: true
    },
    payDate: String,
    amount: Number,
    canEnd: Boolean,
    user: { type: Schema.Types.ObjectId, ref: 'User' }
})

categorySchema.post('findOneAndDelete', async function (cat) {
    const id = cat._id
    if (cat) {
        await Budget.updateMany({ $pull: { categories: { category: { _id: id } } } })
        await Transaction.deleteMany({ category: cat._id })
    }
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category