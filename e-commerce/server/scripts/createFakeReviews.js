import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

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

const createFakeReviews = async () => {
    try {
        console.log('Creating fake reviews for all products...');
        
        // Sử dụng native MongoDB driver thông qua mongoose connection
        const db = mongoose.connection.db;
        
        // Lấy danh sách sản phẩm
        const products = await db.collection('products').find({}).toArray();
        console.log(`Found ${products.length} products`);
        
        // Lấy danh sách users
        const users = await db.collection('users').find({}).toArray();
        console.log(`Found ${users.length} users`);
        
        if (products.length === 0 || users.length === 0) {
            console.log('No products or users found');
            return;
        }
        
        // Xóa reviews cũ
        const deleteResult = await db.collection('reviews').deleteMany({});
        console.log(`Cleared ${deleteResult.deletedCount} existing reviews`);
        
        // Dữ liệu đánh giá ảo đa dạng
        const fakeReviews = [
            {
                rating: 5,
                comments: [
                    "Sản phẩm chất lượng rất tốt, giao hàng nhanh chóng. Tôi rất hài lòng với việc mua hàng này!",
                    "Tuyệt vời! Đúng như mô tả, chất lượng cao cấp. Sẽ mua lại!",
                    "Sản phẩm xuất sắc! Vượt quá mong đợi của tôi. Rất đáng tiền!",
                    "Chất lượng tuyệt vời, thiết kế đẹp mắt. Tôi rất thích!",
                    "Rất hài lòng với chất lượng và dịch vụ. Sẽ giới thiệu cho bạn bè!",
                    "Tuyệt vời! Đúng như quảng cáo, chất lượng cao cấp.",
                    "Chất lượng xuất sắc! Giao hàng nhanh chóng. Rất đáng tiền!",
                    "Sản phẩm tuyệt vời! Chất lượng cao cấp, giá cả phải chăng.",
                    "Rất tốt! Đúng như mô tả, giao hàng đúng hẹn. Sẽ mua lại!",
                    "Sản phẩm chất lượng cao, thiết kế hiện đại. Tôi rất thích!"
                ]
            },
            {
                rating: 4,
                comments: [
                    "Sản phẩm đẹp, giá cả hợp lý. Chỉ hơi chậm một chút trong việc giao hàng.",
                    "Chất lượng tốt, giá cả phải chăng. Khuyến nghị mua!",
                    "Tốt, nhưng có thể cải thiện về bao bì.",
                    "Sản phẩm tốt, giao hàng đúng hẹn. Cảm ơn shop!",
                    "Sản phẩm ổn, nhưng có thể cải thiện về giá cả.",
                    "Chất lượng tốt, thiết kế đẹp. Khuyến nghị!",
                    "Sản phẩm đẹp, giá cả hợp lý. Hài lòng với việc mua hàng!",
                    "Tốt, thiết kế đẹp mắt. Khuyến nghị mua!",
                    "Hài lòng với chất lượng và dịch vụ. Cảm ơn shop!",
                    "Sản phẩm tốt, thiết kế đẹp. Khuyến nghị mua!"
                ]
            },
            {
                rating: 3,
                comments: [
                    "Sản phẩm ổn, nhưng có thể cải thiện thêm về mặt thiết kế.",
                    "Sản phẩm ổn, nhưng có thể cải thiện về mặt dịch vụ khách hàng.",
                    "Chất lượng ổn, nhưng giá cả hơi cao so với chất lượng.",
                    "Sản phẩm đúng như mô tả, nhưng giao hàng hơi chậm.",
                    "Thiết kế đẹp, nhưng chất liệu có thể cải thiện thêm.",
                    "Sản phẩm ổn, nhưng có thể cải thiện về bao bì.",
                    "Chất lượng trung bình, giá cả hợp lý.",
                    "Sản phẩm đúng như quảng cáo, nhưng có thể cải thiện thêm.",
                    "Thiết kế đẹp, nhưng độ bền cần cải thiện.",
                    "Sản phẩm ổn, nhưng có thể cải thiện về mặt dịch vụ."
                ]
            }
        ];
        
        // Tên người dùng ảo
        const fakeUserNames = [
            "Nguyễn Văn An", "Trần Thị Bình", "Lê Văn Cường", "Phạm Thị Dung",
            "Hoàng Văn Em", "Vũ Thị Phương", "Đặng Văn Giang", "Bùi Thị Hoa",
            "Ngô Văn Khoa", "Lý Thị Lan", "Võ Văn Minh", "Đỗ Thị Nga",
            "Hồ Văn Phúc", "Dương Thị Quỳnh", "Tô Văn Sinh", "Lưu Thị Trang",
            "Đinh Văn Uy", "Mai Thị Vân", "Lâm Văn Xuân", "Hà Thị Yến"
        ];
        
        let totalReviews = 0;
        
        // Tạo reviews cho mỗi sản phẩm
        for (const product of products) {
            console.log(`Creating reviews for: ${product.name}`);
            
            // Tạo 3-8 reviews cho mỗi sản phẩm
            const numReviews = Math.floor(Math.random() * 6) + 3;
            
            for (let i = 0; i < numReviews; i++) {
                // Chọn rating ngẫu nhiên (ưu tiên rating cao)
                const ratingGroup = Math.random() < 0.6 ? 0 : (Math.random() < 0.8 ? 1 : 2);
                const ratingData = fakeReviews[ratingGroup];
                
                // Chọn comment ngẫu nhiên
                const comment = ratingData.comments[Math.floor(Math.random() * ratingData.comments.length)];
                
                // Tạo user ảo
                const fakeUserName = fakeUserNames[Math.floor(Math.random() * fakeUserNames.length)];
                
                // Tạo avatar placeholder
                const avatarPlaceholder = fakeUserName.split(' ').pop().charAt(0).toUpperCase();
                
                // Tạo review
                const review = {
                    productID: product._id,
                    userID: {
                        _id: new mongoose.Types.ObjectId(),
                        username: fakeUserName,
                        avatar: null
                    },
                    rating: ratingData.rating,
                    comment: comment,
                    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date trong 90 ngày qua
                    updatedAt: new Date()
                };
                
                await db.collection('reviews').insertOne(review);
                totalReviews++;
            }
        }
        
        console.log(`✅ Created ${totalReviews} fake reviews`);
        
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
        
        console.log('🎉 Fake reviews created successfully!');
        
    } catch (error) {
        console.error('❌ Error creating fake reviews:', error);
        throw error;
    }
};

const main = async () => {
    try {
        await connectForSeeding();
        await createFakeReviews();
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
