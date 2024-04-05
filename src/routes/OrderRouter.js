const express = require("express");
const router = express.Router();
const orderController = require('../controllers/OrderController');
const { authMiddleware, authUserMiddleware } = require("../middleware/authMiddleware");

router.post('/create', authUserMiddleware, orderController.createOrder)
router.get('/get-all-order', authMiddleware, orderController.getAllOrder)
router.get('/get-order-user/:id', authUserMiddleware, orderController.getAllOrderByUserId)
router.get('/get-detail-order/:id', authUserMiddleware, orderController.getDetailOrder)
router.put('/update-order/:id', authUserMiddleware, orderController.updateOrder)
router.delete('/cancel-order/:id', authUserMiddleware, orderController.cancelOrder)


module.exports = router;