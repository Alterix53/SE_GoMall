import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  slug: { type: String, required: true },
  description: String,
  image: String,
  icon: String,
});

export default mongoose.model("Category", categorySchema);