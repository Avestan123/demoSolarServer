const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  email:{ type: String, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['Super Admin', 'Admin', 'Sales', 'Accounts', 'Customer Care', 'Services'],
    default: 'Customer Care', // Set a default role if not provided
    required: true,
  },
  passwordResetOTP: { type: String }, // Add this field for storing the OTP
});

module.exports = mongoose.model('User', userSchema);