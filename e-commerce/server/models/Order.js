import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    orderDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending', index: true },
    total: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    paymentMethod: { type: String },
    items: [{
        productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true },
        discount: { type: Number, default: 0 }
    }],
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);