const OrderService = require('../services/OrderService');

const createOrder = async (req, res) => {
    try {
        const {
            paymentMethod, orderItems, shippingMethod, price, shippingAddress
        } = req.body;

        const { email, address, phone } = shippingAddress;
        if (!paymentMethod || !orderItems || !shippingMethod || !price || !email || !address || !phone) {

            //Thiếu thông tin
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await OrderService.createOrder(req.body);
        return res.status(200).json(response);

    } catch (e) {
        return res.status(404).json({
            err: e.message
        })
    }
}

const getAllOrder = async (req, res) => {
    try {
        const response = await OrderService.getAllOrder();
        return res.status(200).json(response);

    } catch (e) {
        return res.status(404).json({
            err: e.message
        })
    }
}

const getAllOrderByUserId = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await OrderService.getOrderById(userId);
        return res.status(200).json(response);

    } catch (e) {
        return res.status(404).json({
            err: e.message
        })
    }
}

const getDetailOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The Id Order is required'
            })
        }
        const response = await OrderService.getOrderDetail(orderId);
        return res.status(200).json(response);

    } catch (e) {
        return res.status(404).json({
            err: e.message
        })
    }
}

const updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const data = req.body;
        if (!orderId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The OrderId is required'
            })
        }

        const response = await OrderService.updateOrder(orderId, data);
        return res.status(200).json(response);

    } catch (e) {
        return res.status(404).json({
            err: e.message
        })
    }
}

const cancelOrder = async (req, res) => {
    try {
        const data = req.body.orderItems;
        const orderId = req.params.id;
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The Id Order is required'
            })
        }
        const response = await OrderService.cancelOrder(orderId, data);
        return res.status(200).json(response);

    } catch (e) {
        return res.status(404).json({
            err: e.message
        })
    }
}


module.exports = {
    createOrder,
    getAllOrder,
    getAllOrderByUserId,
    getDetailOrder,
    updateOrder,
    cancelOrder
}