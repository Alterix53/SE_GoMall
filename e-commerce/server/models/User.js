import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    role: { type: [String], enum: { values: ['user', 'admin', 'seller'], message: '{VALUE} is not a valid role' }, default: ['user'], index: true },
    fullName: { type: String },
    phoneNumber: { type: String },
    address: { type: String },
    shopName: { type: String }, // Chỉ dùng cho seller
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

export default mongoose.model('User', userSchema);