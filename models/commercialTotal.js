const mongoose = require('mongoose');

const commercialTotalSchema = new mongoose.Schema({
    billAmt: {
        type: String,
    },
    meterCharges: {
        type: String,
    },
    otherCharges: {
        type: String,
    },
    totalCost: {
        type: String,
    }

});

module.exports = mongoose.model("commercialTotalSchema", commercialTotalSchema);