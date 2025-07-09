const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'Admin' },
    lastLogin: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Admin', adminSchema);