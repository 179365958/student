const express = require('express')
const router = express.Router()
const dbController = require('../controllers/dbController')

router.post('/initialize', dbController.initializeDb)

module.exports = router
