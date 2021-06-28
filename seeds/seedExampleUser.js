const Budget = require('../models/budget')
const Transaction = require('../models/transaction')
const Category = require('../models/category')
const moment = require('moment');
moment().format();

const seedUser = async (user) => {
    await Category.deleteMany({ user })
    await Budget.deleteMany({ user })
    await Transaction.deleteMany({ user })
    await Category.insertMany([
        {
            title: "Rent",
            fixed: true,
            payDate: "5",
            user: "60da2f71165c5b8c8167eea0"
        },
        {
            title: "Groceries",
            fixed: false,
            user: "60da2f71165c5b8c8167eea0"
        },
        {
            title: "Gas",
            fixed: false,
            user: "60da2f71165c5b8c8167eea0"
        },
        {
            title: "Utilities",
            fixed: true,
            payDate: "3",
            user: "60da2f71165c5b8c8167eea0"
        },
        {
            title: "Eating Out",
            fixed: false,
            payDate: "25",
            user: "60da2f71165c5b8c8167eea0"
        },
    ])
    const cats = await Category.find({ user: user })
    await Budget.insertMany([
        {
            amount: 3000,
            month: moment("2021-05-01"),
            user: "60da2f71165c5b8c8167eea0",
            categories: [
                {
                    category: cats[0]._id,
                    amount: 1100
                },
                {
                    category: cats[1]._id,
                    amount: 600
                },
                {
                    category: cats[2]._id,
                    amount: 150
                },
                {
                    category: cats[3]._id,
                    amount: 167
                },
                {
                    category: cats[4]._id,
                    amount: 100
                },
            ]

        },
        {
            amount: 4000,
            month: moment("2021-06-01"),
            user: "60da2f71165c5b8c8167eea0",
            categories: [
                {
                    category: cats[0]._id,
                    amount: 1100
                },
                {
                    category: cats[1]._id,
                    amount: 600
                },
                {
                    category: cats[2]._id,
                    amount: 150
                },
                {
                    category: cats[3]._id,
                    amount: 223
                },
                {
                    category: cats[4]._id,
                    amount: 175
                },
            ]

        },
        {
            amount: 5000,
            month: moment("2021-07-01"),
            user: "60da2f71165c5b8c8167eea0",
            categories: [
                {
                    category: cats[0]._id,
                    amount: 1100
                },
                {
                    category: cats[1]._id,
                    amount: 500
                },
                {
                    category: cats[2]._id,
                    amount: 250
                },
                {
                    category: cats[3]._id,
                    amount: 118
                },
                {
                    category: cats[4]._id,
                    amount: 300
                },
            ]
        }
    ])
    await Transaction.insertMany([
        {
            category: cats[0]._id,
            date: moment("2021-05-05"),
            isFixed: true,
            amount: 1100,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[0]._id,
            date: moment("2021-06-05"),
            isFixed: true,
            amount: 1100,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[0]._id,
            date: moment("2021-07-05"),
            isFixed: true,
            amount: 1100,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[1]._id,
            date: `2021-05-${Math.floor(Math.random() * 29) + 2}`,
            isFixed: true,
            amount: `${Math.floor(Math.random() * 150) + 100}`,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[1]._id,
            date: `2021-05-${Math.floor(Math.random() * 29) + 2}`,
            isFixed: true,
            amount: `${Math.floor(Math.random() * 150) + 100}`,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[1]._id,
            date: `2021-06-${Math.floor(Math.random() * 29) + 2}`,
            isFixed: true,
            amount: `${Math.floor(Math.random() * 150) + 100}`,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[1]._id,
            date: `2021-06-${Math.floor(Math.random() * 29) + 2}`,
            isFixed: true,
            amount: `${Math.floor(Math.random() * 150) + 100}`,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[1]._id,
            date: `2021-07-${Math.floor(Math.random() * 29) + 2}`,
            isFixed: true,
            amount: `${Math.floor(Math.random() * 150) + 100}`,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[1]._id,
            date: `2021-07-${Math.floor(Math.random() * 29) + 2}`,
            isFixed: true,
            amount: `${Math.floor(Math.random() * 150) + 100}`,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[2]._id,
            date: `2021-05-${Math.floor(Math.random() * 29) + 2}`,
            isFixed: true,
            amount: `${Math.floor(Math.random() * 60) + 1}`,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[2]._id,
            date: `2021-05-${Math.floor(Math.random() * 29) + 2}`,
            isFixed: true,
            amount: `${Math.floor(Math.random() * 60) + 1}`,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[2]._id,
            date: `2021-05-${Math.floor(Math.random() * 29) + 2}`,
            isFixed: true,
            amount: `${Math.floor(Math.random() * 60) + 1}`,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[2]._id,
            date: `2021-06-${Math.floor(Math.random() * 29) + 2}`,
            isFixed: true,
            amount: `${Math.floor(Math.random() * 60) + 1}`,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[2]._id,
            date: `2021-06-${Math.floor(Math.random() * 29) + 2}`,
            isFixed: true,
            amount: `${Math.floor(Math.random() * 60) + 1}`,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[2]._id,
            date: `2021-06-${Math.floor(Math.random() * 29) + 2}`,
            isFixed: true,
            amount: `${Math.floor(Math.random() * 60) + 1}`,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[2]._id,
            date: `2021-07-${Math.floor(Math.random() * 29) + 2}`,
            isFixed: true,
            amount: `${Math.floor(Math.random() * 60) + 1}`,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[2]._id,
            date: `2021-07-${Math.floor(Math.random() * 29) + 2}`,
            isFixed: true,
            amount: `${Math.floor(Math.random() * 60) + 1}`,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[2]._id,
            date: `2021-07-${Math.floor(Math.random() * 29) + 2}`,
            isFixed: true,
            amount: `${Math.floor(Math.random() * 60) + 1}`,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[3]._id,
            date: moment(`2021-05-03`),
            isFixed: true,
            amount: 167,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[3]._id,
            date: moment(`2021-06-03`),
            isFixed: true,
            amount: 223,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[3]._id,
            date: moment(`2021-07-03`),
            isFixed: true,
            amount: 118,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[4]._id,
            date: `2021-05-${Math.floor(Math.random() * 29) + 2}`,
            isFixed: true,
            amount: `${Math.floor(Math.random() * 25) + 5}`,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[4]._id,
            date: `2021-05-${Math.floor(Math.random() * 29) + 2}`,
            isFixed: true,
            amount: `${Math.floor(Math.random() * 25) + 5}`,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[4]._id,
            date: `2021-05-${Math.floor(Math.random() * 29) + 2}`,
            isFixed: true,
            amount: `${Math.floor(Math.random() * 25) + 5}`,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[4]._id,
            date: `2021-05-${Math.floor(Math.random() * 29) + 2}`,
            isFixed: true,
            amount: `${Math.floor(Math.random() * 25) + 5}`,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[4]._id,
            date: `2021-06-${Math.floor(Math.random() * 29) + 2}`,
            isFixed: true,
            amount: `${Math.floor(Math.random() * 25) + 5}`,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[4]._id,
            date: `2021-06-${Math.floor(Math.random() * 29) + 2}`,
            isFixed: true,
            amount: `${Math.floor(Math.random() * 25) + 5}`,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[4]._id,
            date: `2021-06-${Math.floor(Math.random() * 29) + 2}`,
            isFixed: true,
            amount: `${Math.floor(Math.random() * 25) + 5}`,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[4]._id,
            date: `2021-06-${Math.floor(Math.random() * 29) + 2}`,
            isFixed: true,
            amount: `${Math.floor(Math.random() * 25) + 5}`,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[4]._id,
            date: `2021-07-${Math.floor(Math.random() * 29) + 2}`,
            isFixed: true,
            amount: `${Math.floor(Math.random() * 25) + 5}`,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[4]._id,
            date: `2021-07-${Math.floor(Math.random() * 29) + 2}`,
            isFixed: true,
            amount: `${Math.floor(Math.random() * 25) + 5}`,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[4]._id,
            date: `2021-07-${Math.floor(Math.random() * 29) + 2}`,
            isFixed: true,
            amount: `${Math.floor(Math.random() * 25) + 5}`,
            user: "60da2f71165c5b8c8167eea0",
        },
        {
            category: cats[4]._id,
            date: `2021-07-${Math.floor(Math.random() * 29) + 2}`,
            isFixed: true,
            amount: `${Math.floor(Math.random() * 25) + 5}`,
            user: "60da2f71165c5b8c8167eea0",
        },
    ])
}

module.exports = seedUser