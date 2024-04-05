const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    orderItems: [
        {
            name: { type: String, required: true },
            amount: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            type: { type: String, required: true },
            countInStock: { type: Number, required: true },
            discount: { type: Number },
            rating: { type: Number },
            amountRate: { type: Number, default: 0 },
            isRating: { type: Boolean, default: false },
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            }
        }
    ],
    shippingAddress: {
        email: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: Number, required: true },
    },
    paymentMethod: { type: String, required: true },
    shippingMethod: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    price: { type: Number, required: true },
    status: { type: String, default: "waiting_confirm", },
    paidAt: { type: Date },
    deliveredAt: { type: Date }
},
    {
        // Auto add createAdd and UpdateAdd
        timestamps: true
    }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;