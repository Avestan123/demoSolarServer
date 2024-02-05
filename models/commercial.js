const mongoose = require('mongoose');

const commercialDetailsSchema = new mongoose.Schema({
    productDetails: [{
        product: {
            type: String,
        },
        spvCapacity: {
            type: String,
        },
        unitPrice: {
            type: String,
        },
        amount: {
            type: String,
        },
        description: {
            type: String,
        }
    }],
});

module.exports = mongoose.model("CommercialDetails", commercialDetailsSchema);
