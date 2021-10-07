const User = require('../models/user')
const jwt = require('jsonwebtoken')


exports.signup = (req, res) => {
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
}

exports.login = (req, res) => {
    User.findOne({
        username: req.body.username.toLowerCase()
    }, (err, user) =>  {
        if (err) throw err
        if (!user) {
            res.status(403).send({success: false, msg: 'Authentication Failed, User not found'})
        }
        else {
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    var token = jwt.sign({ userId: user._id }, "secretkey")
                    res.status(200).json({success: true, token: token})
                }
                else {
                    return res.status(403).send({success: false, msg: 'Authentication failed, wrong password'})
                }
            })
        }
    })
}

exports.getUserData = (req, res) => {
    let token = req.headers.token; // token
    jwt.verify(token, 'secretkey', (err, decoded) => {
        if(err) return res.status(401).json({
            title: 'unauthorized'
        })

        //token is valid
        User.findOne({ _id: decoded.userId }, (err, user) => {
            const { _id, email, phone, username, gender } = user;
            if(err) return res.status(404).json({ err })
            return res.status(200).json({
                title: 'User gotten',
                user: {
                    _id,
                    email,
                    phone,
                    username,
                    gender
                }
            })
        })
    })
}

exports.getSingleUserData = (req, res) => {
    User.findOne({ username: req.body.username })
    .then(user => {
        return res.status(200).json(user)
    })
    .catch(err => {
        return res.status(500).json({err})
    })
}


exports.getAllUsersData = (req, res) => {
    User.find({})
    .then(users => {
        return res.status(200).json(users)
    })
    .catch(err => {
        return res.status(500).json({err})
    })
}

// exports.approveUser = (req, res) => {
//     User.findOneAndUpdate({ email: req.body.email }, { $set: 
//         { 
//             approved: true, 
//         }
//     })
//     .then(user => {
//         res.status(201).json({ user })
//     })
//     .catch(err => res.status(500).json({ err }))
// }