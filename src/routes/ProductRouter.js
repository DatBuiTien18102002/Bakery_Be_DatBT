const express = require("express");
const router = express.Router();
const productController = require('../controllers/ProductController');
const { authMiddleware } = require("../middleware/authMiddleware");


router.post('/create-product', productController.createProduct);
router.put('/update-product/:id', productController.updateProduct);
router.get('/get-detail/:id', productController.getDetailProduct);
router.delete('/delete-product/:id', productController.deleteProduct);
router.get('/getProducts', productController.getProducts);


//Nên tạo const ở fe rồi dùng select để chọn
router.get('/getAllType', productController.getAllType);


module.exports = router;