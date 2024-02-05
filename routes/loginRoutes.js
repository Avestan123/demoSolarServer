const express = require('express')
const router = express.Router();
const LoginController = require("../controllers/login.controller")

//user sign in api 
router.post('/signin', LoginController.signin);

module.exports = router