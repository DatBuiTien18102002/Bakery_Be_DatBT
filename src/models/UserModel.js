const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
    {
        name: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: Number },
        isAdmin: { type: Boolean, default: false, required: true },
        address: { type: String },
        avatar: { type: String },
    },
    {
        // Mongoose sẽ tự động thêm hai trường createdAt và updatedAt vào mỗi bản ghi để theo dõi thời gian tạo và thời gian cập nhật.
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);
module.exports = User;