import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Canonical naming: businessName/businessAddress/businessPhone/businessEmail
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    businessDescription: {
      type: String,
      default: '',
      trim: true,
    },
    businessAddress: {
      type: String,
      default: '',
      trim: true,
    },
    businessPhone: {
      type: String,
      default: '',
      trim: true,
    },
    businessEmail: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },
    // Frequently used fields in controllers/routes
    businessLicense: {
      type: String,
      required: true,
      trim: true,
    },
    verificationDocs: {
      type: [String],
      default: [],
    },
    taxNumber: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    approvedAt: {
      type: Date,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalSales: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Seller', sellerSchema);
