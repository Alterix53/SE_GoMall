import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    categoryName: { type: String, required: true, index: true },
    slug: { type: String, required: true, index: true },
    description: String,
    image: String,
    icon: String,
    parentID: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);