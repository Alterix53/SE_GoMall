import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const sellerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    password: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    storeName: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    phoneNumber: {
        type: String,
        required: true
    },

    verificationDocs: {
        type: [String], 
        default: []
    },

    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
        index: true
    },

    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },

    isActive: {
        type: Boolean,
        default: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true });

sellerSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

export default mongoose.model('Seller', sellerSchema);
