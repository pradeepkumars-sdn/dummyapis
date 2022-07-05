const express = require('express')
const router = express.Router();
// const userController = require('../controllers/userController')
const productController = require('../controllers/productController')


router.post('/add-product',productController.createProduct )
router.post('/add-shop',productController.add_shop )
router.post('/delete-shop',productController.deleteShop )

















module.exports = router