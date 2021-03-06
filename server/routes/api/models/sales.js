const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    ticketNo: Number,
    plateNo: String,
    validDate: {
        type: Date,
        default: Date.now
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Sale", saleSchema);