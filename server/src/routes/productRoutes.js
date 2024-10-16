const express = require('express')
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate } = require('../Middleware/authenticate');
router.get('/',  productController.getAllProducts)
router.get('/id/:id', productController.findProductById)
router.get('/search', productController.searchProducts);
module.exports = router;
