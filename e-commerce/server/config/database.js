import mongoose from "mongoose";

const connectDB = async (uri) => {
    try {
        const conn = await mongoose.connect(uri); // Loại bỏ tùy chọn deprecated
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;