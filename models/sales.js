const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    ticketNo: Number,
    plateNo: String,
    validDate: Date,
    vendorId: {
        type: mongoose.schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model("Sale", saleSchema);