const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;  // Import the fs.promises module for file system operations
const Customers = require('../models/customer');
const nodemailer = require('nodemailer'); // npm install nodemailer

const cloudinary = require("cloudinary").v2;

const salesController = require("../controllers/sales.controller")
const checkAuth = require("../middleware/checkAuth")


router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use(express.urlencoded({ extended: true }));
router.use('/uploads', express.static('uploads'));

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

// ... (your existing imports)

router.post('/addCustomer', upload.fields([
  { name: 'electricitybill', maxCount: 1 },
  { name: 'pancard', maxCount: 1 },
  { name: 'adharcard', maxCount: 1 },
  { name: 'taxreceipt', maxCount: 1 }
]), salesController.addCustomer);

router.post('/saveAndTransfer', upload.fields([
  { name: 'electricitybill', maxCount: 1 },
  { name: 'pancard', maxCount: 1 },
  { name: 'adharcard', maxCount: 1 },
  { name: 'taxreceipt', maxCount: 1 }
]), salesController.saveAndTransfer);

// ... (your other routes)



router.get('/get_all_customers',  salesController.get_all_customers);
router.get('/getHighValueLeads', salesController.getHighValueLeads);
router.get('/getMyLeads', salesController.getMyLeads);
router.get('/getMoreThan3FollowUpsLeads', salesController.getMoreThan3FollowUpsLeads);
router.post('/setCustomerAsLost/:customerId', salesController.setCustomerAsLost)
router.get('/get_todays_leads', salesController. get_todays_leads );
router.post('/updateCustomerDetails/:customerId',  upload.fields([
  { name: 'electricitybill', maxCount: 1 },
  { name: 'pancard', maxCount: 1 },
  { name: 'adharcard', maxCount: 1 },
  { name: 'taxreceipt', maxCount: 1 }
]), salesController.updateCustomerDetails)

router.post('/deleteCustomer', salesController.deleteCustomer)




//verify User for resete password
router.post('/verify_user', salesController.verify_user);

//verify OTP 
router.post('/verify_otp', salesController.verify_otp);

//Submit verifyed Password 
router.put('/submit_password_reset', salesController.submit_password_reset);

// //get pending customers
// router.get('/get_pending_customer', salesController.get);

// //get Success customers
// router.get('/get_success_customer', async (req,res) => {
//   try {
//     // Fetch all Pending customers from the database
//     const PendingCustomers = await Customers.find({ status: 'success' });
//     res.status(200).json({ customers: PendingCustomers });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });



module.exports = router;