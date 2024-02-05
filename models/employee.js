const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    middleName: { type: String },
    surName: { type: String, required: true },
    address: { type: String },
    pincode: { type: String },
    temporaryAddress: { type: String },
    mobileNo: { type: String },
    alternateNo: { type: String },
    email: { type: String, unique: true },
    referralName: { type: String },
    referralPhoneNo: { type: String },
    referralAddress: { type: String },
    adharCard: String,
    panCard: String,
    markSheet: String,
    drivingLicense: String,
    bankDetailPhoto: String,
    accountHolderName: String,
    accountNo: String,
    ifscCode: String,
    employeeDepartment: String,
    employeeId: { type: String, required: true, unique: true },
    employeePassword: { type: String, required: true },
    employeeRole: {
      type: String,
      required: true,
      enum: [
        "Admin",
        "Sales Executive",
        "Sales Manager",
        "General Sales Manager",
        "Accounts",
        "Customer Care",
        "Services",
      ],
    },
    isEmployee: {
      type: String,
      default: true,
    },
    passwordResetOTP: { type: String }, // Add this field for storing the OTP
    transferredLeads: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
    }],
    assignedLeads: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
    }]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Employee", employeeSchema);
