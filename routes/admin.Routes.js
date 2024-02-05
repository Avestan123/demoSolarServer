const express = require('express')
const router = express.Router();
const adminController = require('../controllers/admin.controller')
const multer = require('multer');
const checkAuth = require("../middleware/checkAuth")

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/addEmployee", upload.fields([
    { name: 'adharCard', maxCount: 1 },
    { name: 'panCard', maxCount: 1 },
    { name: 'markSheet', maxCount: 1 },
    { name: 'drivingLicense', maxCount: 1 },
    { name: 'bankDetailPhoto', maxCount: 1 },
  ]),adminController.addEmployee);
router.get("/getAllEmployees",adminController.getAllEmployees)
router.post("/updateEmpoyeeDetails/:empId",adminController.updateEmpoyeeDetails)
router.post("/deleteEmployee",adminController.deleteEmployee)


module.exports = router