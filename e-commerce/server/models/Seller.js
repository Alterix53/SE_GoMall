import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema({
    userID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    businessName: { 
        type: String, 
        required: true 
    },
    businessDescription: { 
        type: String 
    },
    businessAddress: { 
        type: String 
    },
    businessPhone: { 
        type: String 
    },
    businessEmail: { 
        type: String 
    },
    taxNumber: { 
        type: String 
    },
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected', 'suspended'], 
        default: 'pending' 
    },
    approvedAt: { 
        type: Date 
    },
    approvedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    rating: { 
        type: Number, 
        default: 0 
    },
    totalSales: { 
        type: Number, 
        default: 0 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

export default mongoose.model('Seller', sellerSchema);
