const Budget = require('../models/budget');
const Category = require('../models/category');
const { updateBudgets } = require('../utils/categoryHelpers');
const numSuffix = require('../utils/numSuffix')

module.exports.index = async (req, res) => {
    const categories = await Category.find({})
    categories.sort(function (a, b) {                                       // 
        if (a.title.toLowerCase() < b.title.toLowerCase()) { return -1; }   // sorts categories alphabetically
        if (a.title.toLowerCase() > b.title.toLowerCase()) { return 1; }    //
        return 0;                                                           //
    })
    for (let c of categories) {
        c.payDate = numSuffix(c.payDate)    // adds the appropriate suffix to the date (i.e. 1st, 11th, 22nd etc)
    }
    res.render('categories/index', { categories })
}

module.exports.createCategory = async (req, res) => {
    const category = new Category(req.body.category)
    category.user = req.user._id
    await category.save()
    updateBudgets(category) // pushes new category onto existing budgets with $0 budgeted for the budget periods
    req.flash('success', 'Successfully created new category!')
    res.redirect('/categories')
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
        req.flash('error', 'Category not found')
        return res.redirect('/categories')
    }
    res.render('categories/edit', { category });
}

module.exports.updateCategory = async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, { ...req.body.category })
    res.redirect('/categories')
}

module.exports.deleteCategory = async (req, res) => {
    const { id } = req.params
    const category = await Category.findByIdAndDelete(id)
    const budgets = await Budget.find({})
    for (let b of budgets) {                            //
        b.categories.remove({ id: { $in: category } })  // removes all references to category on existing budget models
    }                                                   //
    res.redirect('/categories')
}