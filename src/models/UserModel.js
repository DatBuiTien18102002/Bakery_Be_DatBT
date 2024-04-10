const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
    {
        name: { type: String },
        email: { type: String, unique: true },
        password: { type: String },
        phone: { type: Number },
        isAdmin: { type: Boolean, default: false, required: true },
        address: { type: String },
        avatar: { type: String },
        ggId: { type: String },
        fbId: { type: String },
        provider: { type: String }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);
module.exports = User;