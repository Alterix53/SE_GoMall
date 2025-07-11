const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    orderID: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    transactionID: { type: String },
    status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', paymentSchema);