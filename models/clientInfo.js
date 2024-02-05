const mongoose = require('mongoose');
const PlantDetails = require('./plantsDetails');
const LiasoningDetails = require('./liasoningDetails');
const Commercial = require('./commercial');
const CommercialTotal = require('./commercialTotal');
const Payment = require('./Payment');
const Documents = require('./documents');
const Employee = require("./employee")

const clientinfoSchema = new mongoose.Schema({
    clientName: {
        type: String,
    },
    category: {
        type: String,
    },
    contactPersonName: {
        type: String,
    },
    emailID: {
        type: String,
        unique: true,
    },
    address: { type: String },
    state: { type: String },
    city: { type: String },
    pin: { type: String },
    dob: { type: String },
    orderType: { type: String },
    kilowatts: { type: Number },
    retailProductName: { type: String },
    remarks: { type: String },
    scaleOfOrder: { type: String },
    source: { type: String },
    otherSource: String,
    referralName: { type: String },
    billingAdd: {
        type: String,
    },
    gstNumber: {
        type: String,
    },
    billingUnitNumber: {
        type: String,
    },
    consumerNumber:{
        type: String,
    },
    clientBookBy: {
        type: String,
    },
    deliveryAdd: {
        type: String,
    },
    contactNumber: {
        type: String,
    },
    contactNumberForDispatch: String,
    altNumber: { type: String },
    contactPersonNameInst: {
        type: String,
    },
    transportationDetails: {
        type: String,
    },
    anyAddRemark: {
        type: String,
    },
    documents_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Documents'
    },
    PlantDetails_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'plantDetails'
    },
    LiasoningDetails_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'liasoningDetails'
    },
    CommercialSchema_Id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'commercialSchema'
    }],
    CommercialtotalSchema_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'commercialTotalSchema'
    },
    Payment_Id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Employee,
      },
    },
    {
      timestamps: true, // Add this line for timestamps
    }
);

module.exports = mongoose.model("clientInfo", clientinfoSchema);