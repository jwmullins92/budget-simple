const mongoose = require('mongoose')
const Category = require('../models/category')

mongoose.connect('mongodb://localhost:27017/budgetsimple', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected!')
});

const seedDB = async () => {
    await Category.deleteMany({})
    const category = new Category({ title: 'Groceries', amount: 200, fixed: false, canEnd: false })
    await category.save()
    console.log(category)
}

seedDB()