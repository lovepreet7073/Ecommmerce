const express = require('express')
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, isAdmin } = require('../Middleware/authenticate');
const upload = require('../Middleware/multer')



// Define your POST route to handle the product creation with multiple images
router.post('/', authenticate, isAdmin, upload.any(), productController.createProduct);

router.post('/creates', authenticate, isAdmin, productController.createMutipleProducts)
router.delete('/:id/delete', authenticate, isAdmin, productController.deleteProduct)
router.put('/:id', authenticate, isAdmin, productController.updateProduct)
module.exports = router;