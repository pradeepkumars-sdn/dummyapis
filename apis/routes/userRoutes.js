const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController')
const auth = require('../_helper/auth')


router.post('/register',userController.register )
router.post('/user-social-data', userController.userSocialData)
router.post('/create-vendor', userController.create_vendor)
router.post('/update-vendor', userController.update_vendor)
router.post('/update-user', auth,userController.update_user)
router.delete('/delete-user',auth, userController.delete_user)
router.delete('/delete-vendor', userController.delete_vendor)
router.post('/login', userController.login)
router.get('/profile', auth, userController.loggedInUser)


















module.exports = router