const mongoose = require('mongoose');

const documentsSchema = new mongoose.Schema({
    photo: {
        type: String,
    },
    adharcard: {
        type: String,
    },
    pancard: {
        type: String,
    },
    electricitybill: {
        type: String,
    },
    taxreceipt: {
        type: String,
    },
    powerofattorney: {
        type: String,
    },
    annexure2: {
        type: String,
    },
    applicationform:{
        type: String,
    }

});

module.exports = mongoose.model("Documents", documentsSchema);