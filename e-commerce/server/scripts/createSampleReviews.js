import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/GoMall";

const connectForSeeding = async () => {
    try {
        console.log('Connecting to MongoDB...');
        
        // Tắt buffering globally cho Mongoose
        mongoose.set('bufferCommands', false);
        
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB Connected');
        
        // Đợi connection hoàn toàn sẵn sàng
        await mongoose.connection.db.admin().ping();
        console.log('✅ MongoDB connection verified');
        
        return;
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        throw error;
    }
};

const createSampleReviews = async () => {
    try {
        console.log('Creating sample reviews...');
        
        // Sử dụng native MongoDB driver thông qua mongoose connection
        const db = mongoose.connection.db;
        
        // Lấy danh sách sản phẩm
        const products = await db.collection('products').find({}).limit(10).toArray();
        console.log(`Found ${products.length} products`);
        
        // Lấy danh sách users
        const users = await db.collection('users').find({}).limit(5).toArray();
        console.log(`Found ${users.length} users`);
        
        if (products.length === 0 || users.length === 0) {
            console.log('No products or users found');
            return;
        }
        
        // Xóa reviews cũ
        const deleteResult = await db.collection('reviews').deleteMany({});
        console.log(`Cleared ${deleteResult.deletedCount} existing reviews`);
        
        // Tạo reviews mẫu
        const sampleReviews = [];
        const comments = [
            "Sản phẩm chất lượng rất tốt, giao hàng nhanh chóng. Tôi rất hài lòng với việc mua hàng này!",
            "Sản phẩm đẹp, giá cả hợp lý. Chỉ hơi chậm một chút trong việc giao hàng.",
            "Tuyệt vời! Đúng như mô tả, chất lượng cao cấp. Sẽ mua lại!",
            "Sản phẩm ổn, nhưng có thể cải thiện thêm về mặt thiết kế.",
            "Chất lượng tốt, giá cả phải chăng. Khuyến nghị mua!",
            "Sản phẩm xuất sắc! Vượt quá mong đợi của tôi. Rất đáng tiền!",
            "Tốt, nhưng có thể cải thiện về bao bì.",
            "Chất lượng tuyệt vời, thiết kế đẹp mắt. Tôi rất thích!",
            "Sản phẩm tốt, giao hàng đúng hẹn. Cảm ơn shop!",
            "Rất hài lòng với chất lượng và dịch vụ. Sẽ giới thiệu cho bạn bè!",
            "Sản phẩm ổn, nhưng có thể cải thiện về giá cả.",
            "Chất lượng tốt, thiết kế đẹp. Khuyến nghị!",
            "Tuyệt vời! Đúng như quảng cáo, chất lượng cao cấp.",
            "Sản phẩm đẹp, giá cả hợp lý. Hài lòng với việc mua hàng!",
            "Chất lượng xuất sắc! Giao hàng nhanh chóng. Rất đáng tiền!",
            "Sản phẩm ổn, nhưng có thể cải thiện về mặt dịch vụ khách hàng.",
            "Tốt, thiết kế đẹp mắt. Khuyến nghị mua!",
            "Sản phẩm tuyệt vời! Chất lượng cao cấp, giá cả phải chăng.",
            "Hài lòng với chất lượng và dịch vụ. Cảm ơn shop!",
            "Rất tốt! Đúng như mô tả, giao hàng đúng hẹn. Sẽ mua lại!"
        ];
        
        let reviewCount = 0;
        
        // Tạo reviews cho mỗi sản phẩm
        for (const product of products) {
            // Tạo 2-4 reviews cho mỗi sản phẩm
            const numReviews = Math.floor(Math.random() * 3) + 2;
            
            for (let i = 0; i < numReviews; i++) {
                const user = users[Math.floor(Math.random() * users.length)];
                const rating = Math.floor(Math.random() * 3) + 3; // 3-5 sao
                const comment = comments[Math.floor(Math.random() * comments.length)];
                
                const review = {
                    productID: product._id,
                    userID: user._id,
                    rating: rating,
                    comment: comment,
                    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date trong 30 ngày qua
                    updatedAt: new Date()
                };
                
                await db.collection('reviews').insertOne(review);
                sampleReviews.push(review);
                reviewCount++;
            }
        }
        
        console.log(`✅ Created ${reviewCount} sample reviews`);
        
        // Cập nhật rating trung bình cho các sản phẩm
        console.log('Updating product ratings...');
        for (const product of products) {
            const productReviews = await db.collection('reviews').find({ productID: product._id }).toArray();
            if (productReviews.length > 0) {
                const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
                const roundedRating = Math.round(avgRating * 10) / 10;
                
                await db.collection('products').updateOne(
                    { _id: product._id },
                    { 
                        $set: { 
                            averageRating: roundedRating,
                            totalReviews: productReviews.length
                        }
                    }
                );
                console.log(`📊 Updated product ${product.name}: ${roundedRating}⭐ (${productReviews.length} reviews)`);
            }
        }
        
        console.log('🎉 Sample reviews created successfully!');
        
    } catch (error) {
        console.error('❌ Error creating sample reviews:', error);
        throw error;
    }
};

const main = async () => {
    try {
        await connectForSeeding();
        await createSampleReviews();
    } catch (error) {
        console.error('❌ Failed:', error.stack);
        process.exit(1);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
            console.log('✅ Disconnected from MongoDB');
        }
    }
};

main();
