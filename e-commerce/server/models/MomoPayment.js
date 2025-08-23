import mongoose from 'mongoose';

const momoPaymentSchema = new mongoose.Schema({
    // Thông tin cơ bản
    orderID: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true },
    
    // Thông tin MoMo
    partnerCode: { type: String, required: true, default: 'MOMO' },
    requestId: { type: String, required: true, unique: true },
    orderInfo: { type: String, required: true },
    redirectUrl: { type: String, required: true },
    ipnUrl: { type: String, required: true },
    
    // Thông tin giao dịch
    transId: { type: String, unique: true, sparse: true },
    resultCode: { type: Number }, // 0: success, 1000: failed, 1001: pending
    message: { type: String },
    
    // Trạng thái giao dịch
    status: { 
        type: String, 
        enum: ['PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED'], 
        default: 'PENDING',
        index: true 
    },
    
    // Thông tin bổ sung
    signature: { type: String },
    responseTime: { type: Date },
    extraData: { type: String },
    
    // Thông tin người dùng MoMo (nếu có)
    momoPhoneNumber: { type: String },
    momoAccountName: { type: String },
    
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { 
    timestamps: true,
    collection: 'momo_payments'
});

// Indexes
momoPaymentSchema.index({ status: 1, createdAt: -1 });
momoPaymentSchema.index({ userID: 1, createdAt: -1 });

// Pre-save middleware để tạo requestId nếu chưa có
momoPaymentSchema.pre('save', function(next) {
    if (!this.requestId) {
        this.requestId = `MOMO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    this.updatedAt = new Date();
    next();
});

export default mongoose.model('MomoPayment', momoPaymentSchema);
