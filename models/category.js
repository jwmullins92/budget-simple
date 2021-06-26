const mongoose = require('mongoose')
const Budget = require('./budget')
const Transaction = require('./transaction')

const Schema = mongoose.Schema


// Stores a caategory
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


// Deletes all references to a deleted category
categorySchema.post('findOneAndDelete', async function (cat) {
    const id = cat._id
    if (cat) {
        await Budget.updateMany({ $pull: { categories: { category: { _id: id } } } })
        await Transaction.deleteMany({ category: cat._id })
    }
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category