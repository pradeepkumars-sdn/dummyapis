const express = require('express')
const router = express.Router();
const adminController = require('../AdminController/adminController')
const auth = require('../_helper/auth')


router.post('/login', adminController.adminLogin)
router.post('/register-admin', adminController.registerAdmin)
router.get('/profile', auth,adminController.loggedInUser)
router.post('/assign-vendor', auth,adminController.assingVendorToUser)
router.post('/assign-shop-vendor', auth,adminController.assignShopToVendor)













module.exports = router