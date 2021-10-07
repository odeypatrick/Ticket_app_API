const Sale = require('../models/sales')
const User = require('../models/user')

exports.addSales = (req, res) => {
    Sale.create(req.body)
    .then((sale) => {
        // return res.status(200).json({ success: true, msg: "Successful" + sale })
        User.findOneAndUpdate(
            { _id: req.body.vendorId }, 
            { $push: { sales: sale } },
        ).then(() => {
            return res.status(200).json({ msg: "Sales added successfully" })
        })
    })
    .catch(err => {
        return res.status(500).json({ err, success: false })
    })
}

// get All Sale
exports.getAllSales = (req, res) => {
    Sale.find({})
    .then(sales => {
        return res.status(200).json(sales)
    })
    .catch(err => {
        return res.status(500).json({err})
    })
}

// Get sale belonging to a particular user
exports.getSingleSale = (req, res) => {
    Sale.find({vendorId: req.params.vendorId})
    .then(sales => {
        return res.status(200).json(sales)
    })
    .catch(err => {
        return res.status(500).json({err})
    })
}

// Get single Sale
exports.getOneSale = (req, res) => {
    Sale.findById(req.params.id)
    .then(sale => {
        return res.status(200).json(sale)
    })
    .catch(err => {
        return res.status(500).json({ error: err })
    })
}