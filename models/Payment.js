const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    installment: {
        type: String,
    },
    projectCost: {
        type: String,
    },
    paymentMode: {
        type: String,
    },
    paymentDate: {
        type: String,
    },
    percentage: {
        type: String,
    },
    paymentAmount: {
        type: String,
    },
    remainingBalance: {
        type: String,
    }

});

module.exports = mongoose.model("Payment", paymentSchema);