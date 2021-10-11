const router = require('express').Router()
const mongoose = require('mongoose')
const { signup, login, getUserData, getSingleUserData, getAllUsersData } = require('./controllers/auth')
const { addSales, getSingleSale, getAllSales, getOneSale } = require('./controllers/sales')
const { url } = require('./url/url') 
const User = require('./models/user')

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('connection successfull'))
.catch((err) => console.error(err))

router.get('/', (req, res) => {
    res.send("HELLO!! WE ARE LIVE - I am Tickets app api")
})

// router.get('/users', (req, res) => {
//     User.find({})
//     .then((users) => res.json({users}))
//     .catch((err) => res.status(500).json({err}))
// })

router.get('/users', (req, res) => {
    User.find({ }).populate("sales").exec()
    .then((users) => {
        const usersArray = [];
        users.forEach(user => {
            usersArray.push({ user, totalSales: user.sales.length })
        })
        res.status(200).json(usersArray)
    })
    .catch((err) => res.status(500).json({err}))
})


//Signup - can be accessed by only an admin
router.post('/signup', signup)

//login user
router.post('/login', login)

// Get reports
router.get('/sales', getAllSales)

// Get user Sales
router.get('/user/:vendorId/sales', getSingleSale)

// Get single Sale
router.get('/sales/:id', getOneSale)

//Add Sale
router.post('/sales/add', addSales)

//Get User Information
router.get('/user', getUserData)


module.exports = router