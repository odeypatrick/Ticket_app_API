const express = require('express')
const app = express();
const request = require('request')
const cors = require('cors')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

const User = require('./models/users')
const Sale = require('./models/sales');

app.get('/', (req, res) => {
    res.send("We are live")
})


//SEND SMS
app.post('/message/send', (req, res) => {
    const phone = Number(req.body.phone);

    const message = `
        Thank you for purchasing N200 Tricycle Ticket
        Ticket Number: ${req.body.ticketNo} 
        Plate Number: ${req.body.plateNo}
        Valid only on: ${req.body.date} 
    `
    const options = {
        'method': 'POST',
        'url': `https://http-api.d7networks.com/send?username=zrrv5537&password=eBfqofQX&dlr-method=POST&dlr-url=https://4ba60af1.ngrok.io/receive&dlr=yes&dlr-level=3&from=AbiaIRS&content=${encodeURI(message)}&to=+234${phone}`,
        'headers': {

        }
    }

    request(options, function (error, response) {
        if (error) {
            return res.status(500).json({ success: false, msg: error })
        }
        res.status(200).json({ success: true, response: { text: "SMS sent successfully.", id: response.body } })
    })
})

//Signup
app.post('/signup', (req, res) => {
    User.findOne({ username: req.body.username }, (err, user) => {
        if(err) {
            return res.status(500).json({ err })
        }
        if(user) {
            return res.status(401).json({ success: false, msg: "Usern already exists" })
        }

        if ((!req.body.username) || (!req.body.password)) {
            res.json({success: false, msg: 'Enter all fields'})
        }
        else {
            var newUser = User(req.body);
            newUser.save(function (err, newUser) {
                if (err) {
                    res.json({success: false, msg: 'Failed to save'})
                }
                else {
                    res.json({success: true, msg: 'Successfully saved'})
                }
            })
        }
    })
})

// Login
app.post('/login', (req, res) => {
    User.findOne({
        username: req.body.username
    }, (err, user) =>  {
        if (err) throw err
        if (!user) {
            res.status(403).send({success: false, msg: 'Authentication Failed, User not found'})
        }
        else {
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    var token = jwt.sign({ userId: user._id }, config.secret)
                    res.status(200).json({success: true, token: token})
                }
                else {
                    return res.status(403).send({success: false, msg: 'Authentication failed, wrong password'})
                }
            })
        }
    })
})

// Get all users
app.get('/users', (req, res) => {
    User.find({})
    .then(users => {
        return res.status(200).json(users)
    })
    .catch(err => {
        return res.status(500).json({err})
    })
})

// Get single user info
app.get('/users/:username', (req, res) => {
    User.findOne({ username: req.body.username })
    .then(user => {
        return res.status(200).json(user)
    })
    .catch(err => {
        return res.status(500).json({err})
    })
})

// ADDING SALES
app.post('/sales/add', (req, res) => {
    Sale.create(req.body)
    .then(sale => {
        return res.status(200).json({ success: true, msg: "Successful" + sale })
    })
    .catch(err => {
        return res.status(500).json({ err, success: false })
    })

    const PORT = process.env.PORT || 5000

    app.listen(PORT, () => {
        console.log(`Server Running on Port ${PORT}`)
    })
})

//GET ALL SALES
app.get('/sales', (req, res) => {
    Sale.find({})
    .then(sales => {
        return res.status(200).json(sales)
    })
    .catch(err => {
        return res.status(500).json({err})
    })
})

// GET Single sale
app.get('/sales/:vendorId', (req, res) => {
    Sale.find({vendorId: req.params.vendorId})
    .then(sales => {
        return res.status(200).json(sales)
    })
    .catch(err => {
        return res.status(500).json({err})
    })
})
