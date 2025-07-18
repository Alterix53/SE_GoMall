const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    fullName: { type: String },
    phoneNumber: { type: String },
    address: { type: String },
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('User', userSchema);