const mongoose = require('mongoose');

const plantDetailsSchema = new mongoose.Schema({
    // save plantDetails according to userID
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true,
    // },
    panelMake: {
        type: String,
    },
    panelRemarks: {
        type: String,
    },
    inverterMake: {
        type: String,
    },
    inverterRemarks: {
        type: String,
    },
    structureHeight: {
        type: String,
    },
    structureRemark: {
        type: String,
    },
    meterHeight: {
        type: String,
    },
    meterRemark: {
        type: String,
    },
    subsidy: {
        type: String,
    }

});

module.exports = mongoose.model("PlantDetails", plantDetailsSchema);