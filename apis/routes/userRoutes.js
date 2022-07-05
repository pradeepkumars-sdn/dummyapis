const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController')


router.post('/register',userController.register )
router.post('/user-social-data', userController.userSocialData)
router.post('/create-vendor', userController.create_vendor)
router.post('/update-vendor', userController.update_vendor)














module.exports = router