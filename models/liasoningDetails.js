const mongoose = require('mongoose');

const liasoningDetailsSchema = new mongoose.Schema({
    // save plantDetails according to userID
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true,
    // },
    changeOfName: {
        type: String,
    },
    existingName: {
        type: String,
    },
    newName: {
        type: String,
    },
    changeOfLoadExtension: {
        type: String,
    },
    existingLoad: {
        type: String,
    },
    newLoad: {
        type: String,
    },
    changeInMeter: {
        type: String,
    },
    existingMeterType: {
        type: String,
    },
    newMeterType: {
        type: String,
    }

});

module.exports = mongoose.model("liasoningDetails", liasoningDetailsSchema);