const router = require('express').Router()
const mongoose = require('mongoose')
const { signup, login, getUserData, getSingleUserData, getAllUsersData } = require('./controllers/auth')
const { addSales, getSingleSale, getAllSales, getOneSale } = require('./controllers/sales')
const { url } = require('./url/url') 
const User = require('./models/user')
const Sale = require('./models/sales')

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('connection successfull'))
.catch((err) => console.error(err))

router.get('/', (req, res) => {
    res.send("HELLO!! WE ARE LIVE - I am Tickets app api")
})

router.get('/users', (req, res) => {
    User.find({ }).populate("sales").exec()
    .then((users) => {
        const usersArray = [];
        users.forEach(user => {
            const todaySales = user.sales.filter(sale => {
                const today = new Date();
                const saleDate = new Date(sale.createdAt);
                return saleDate.getDate() == today.getDate() && saleDate.getMonth() + 1 == today.getMonth() + 1 &&
                saleDate.getFullYear() == today.getFullYear()
            })
            const monthlySales = user.sales.filter(sale => {
                const today = new Date();
                const saleDate = new Date(sale.createdAt);
                return saleDate.getMonth() + 1 == today.getMonth() + 1 &&
                saleDate.getFullYear() == today.getFullYear()
            })
            usersArray.push({ user, totalSales: user.sales.length, salesForTheMonth: monthlySales.length, salesForTheDay: todaySales.length })
        })
        res.status(200).json({ users: usersArray })
    })
    .catch((err) => res.status(500).json({err}))
})


//Signup -
router.post('/signup', signup)

//login user
router.post('/login', login)

// Get reports
router.get('/sales', getAllSales)

// Get user Sales
router.get('/user/:vendorId/sales', getSingleSale)

// Get single Sale
router.get('/sales/:id', getOneSale)

//Add report
router.post('/sales/add', addSales)

//Get User Information
router.get('/user', getUserData)

// GET the amount of sales in the DB
router.get('/total/sales', (req, res) => {
    Sale.find({})
    .then(sales => res.status(200).json({ totalSales: sales.length })) 
})



module.exports = router