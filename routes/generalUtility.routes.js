const express = require('express');
const router = express.Router();
const generalUtilityController = require("../controllers/generalUtility.controller");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/getAllEmployeesForContext', generalUtilityController.getAllEmployeesNameForContextOtherThanUser);
router.post('/assignLead/:employeeId/:customerId', generalUtilityController.assignLead);
router.post('/deActivateEmployee/:employeeId', generalUtilityController.deActivateEmployee);
router.post('/assignLeadsPermanently/:employeeId/:inactiveEmployeeId', generalUtilityController.assignLeadsPermanently);

module.exports = router;
