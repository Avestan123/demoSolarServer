const express = require('express')
const router = express.Router();
const developerController = require('../controllers/developer.controller')


router.post("/addUser",developerController.addUser )


module.exports = router