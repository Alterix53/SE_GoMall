const mongoose = require('mongoose');

const orderDetailSchema = new mongoose.Schema({
    orderID: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('OrderDetail', orderDetailSchema);