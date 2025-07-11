import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: String,
    shortDescription: String,
    sku: { type: String, required: true },
    brand: String,
    categoryID: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    sellerID: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
    images: [{
        url: String,
        alt: String,
        isPrimary: Boolean,
    }],
    price: {
        original: Number,
        sale: Number,
    },
    inventory: {
        quantity: Number,
        lowStockThreshold: Number,
    },
    specifications: [{
        name: String,
        value: String,
    }],
    tags: [String],
    rating: {
        average: Number,
        count: Number,
    },
    sold: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isFlashSale: { type: Boolean, default: false },
    flashSalePrice: Number,
    flashSaleEndDate: Date,
});

export default mongoose.model("Product", productSchema);