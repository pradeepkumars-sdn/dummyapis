const express = require('express')
const router = express.Router();
const adminController = require('../AdminController/adminController')
const auth = require('../_helper/auth')


router.post('/login', adminController.adminLogin)
router.post('/register-admin', adminController.registerAdmin)
router.get('/profile', auth,adminController.loggedInUser)











module.exports = router