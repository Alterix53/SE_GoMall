const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    cartID: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
    productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    addedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CartItem', cartItemSchema);