import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    orderID: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    transactionID: { type: String },
    status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending', index: true },
    cardInfo: {
        last4: String,
        expiryDate: String,
        maskedNumber: String
    }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);