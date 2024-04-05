const mongoose = require('mongoose');
const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        image: { type: String },
        type: { type: String, required: true },
        price: { type: Number, required: true },
        countInStock: { type: Number, required: true },
        rating: { type: Number, default: 0 },
        amountRate: { type: Number, default: 0 },
        description: { type: String },
        discount: { type: Number },
        sell: { type: Number },
        comments: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
                userAvatar: { type: String },
                userName: { type: String },
                rating: { type: Number },
                comment: { type: String },
                dateComment: { type: Date }
            }
        ]
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;