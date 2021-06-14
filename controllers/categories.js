const Budget = require('../models/budget');
const Category = require('../models/category')

module.exports.index = async (req, res) => {
    const categories = await Category.find({})
    categories.sort(function (a, b) {
        if (a.title.toLowerCase() < b.title.toLowerCase()) { return -1; }
        if (a.title.toLowerCase() > b.title.toLowerCase()) { return 1; }
        return 0;
    })
    res.render('categories/index', { categories })
}

module.exports.createCategory = async (req, res) => {
    const category = new Category(req.body.category)
    category.user = req.user._id
    await category.save()
    const budgets = await Budget.find({})
    let newCat = {}
    newCat.category = category._id
    newCat.amount = 0
    for (let b of budgets) {
        b.categories.push(newCat)
        await b.save()
    }
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
    for (let b of budgets) {
        b.categories.remove({ id: { $in: category } })
    }
    res.redirect('/categories')
}