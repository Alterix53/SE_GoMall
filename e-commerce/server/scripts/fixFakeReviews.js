import mongoose from 'mongoose';
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
        mongoose.set('bufferCommands', false);
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB Connected');
        await mongoose.connection.db.admin().ping();
        console.log('✅ MongoDB connection verified');
        return;
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        throw error;
    }
};

const fixFakeReviews = async () => {
    try {
        console.log('Fixing fake reviews structure...');
        
        const db = mongoose.connection.db;
        
        // Xóa tất cả reviews cũ
        const deleteResult = await db.collection('reviews').deleteMany({});
        console.log(`Cleared ${deleteResult.deletedCount} existing reviews`);
        
        // Lấy danh sách sản phẩm
        const products = await db.collection('products').find({}).toArray();
        console.log(`Found ${products.length} products`);
        
        // Lấy danh sách users thật
        const users = await db.collection('users').find({}).toArray();
        console.log(`Found ${users.length} users`);
        
        if (products.length === 0 || users.length === 0) {
            console.log('No products or users found');
            return;
        }
        
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
                    "Thiết kế đẹp, nhưng chất liệu có thể cải thiện thêm để tăng độ bền.",
                    "Sản phẩm ổn, nhưng có thể cải thiện về mặt bao bì.",
                    "Chất lượng trung bình, giá cả hợp lý.",
                    "Sản phẩm đúng như quảng cáo, nhưng có thể cải thiện thêm.",
                    "Thiết kế đẹp, nhưng độ bền cần cải thiện thêm để xứng đáng với giá tiền.",
                    "Sản phẩm ổn, nhưng có thể cải thiện về mặt dịch vụ."
                ]
            },
            {
                rating: 2,
                comments: [
                    "Sản phẩm không đúng như mô tả, chất lượng thấp hơn mong đợi.",
                    "Thiết kế đẹp nhưng chất liệu kém, dễ hỏng sau thời gian ngắn sử dụng.",
                    "Giao hàng chậm, sản phẩm có vẻ cũ và không như quảng cáo.",
                    "Chất lượng thấp, giá cả không tương xứng với chất lượng sản phẩm.",
                    "Sản phẩm có vẻ giả, không đúng như mô tả và hình ảnh quảng cáo.",
                    "Thiết kế đơn giản, chất liệu rẻ tiền, không xứng đáng với giá tiền.",
                    "Giao hàng sai địa chỉ, sản phẩm bị hỏng trong quá trình vận chuyển.",
                    "Chất lượng kém, thiết kế không đẹp, giá cả quá cao so với chất lượng.",
                    "Sản phẩm không bền, dễ hỏng sau thời gian ngắn sử dụng.",
                    "Dịch vụ khách hàng kém, sản phẩm không đúng như cam kết."
                ]
            },
            {
                rating: 1,
                comments: [
                    "Sản phẩm rất tệ, chất lượng cực kỳ thấp, không đúng như quảng cáo.",
                    "Thiết kế xấu, chất liệu rẻ tiền, dễ hỏng ngay sau khi sử dụng.",
                    "Giao hàng rất chậm, sản phẩm bị hỏng hoàn toàn, không thể sử dụng được.",
                    "Chất lượng cực kém, giá cả quá cao, không xứng đáng với tiền bỏ ra.",
                    "Sản phẩm giả mạo, không phải hàng chính hãng như quảng cáo.",
                    "Thiết kế lỗi thời, chất liệu kém chất lượng, không đáng mua.",
                    "Dịch vụ khách hàng tồi tệ, không giải quyết được vấn đề khiếu nại.",
                    "Sản phẩm bị lỗi nghiêm trọng, không thể sử dụng được.",
                    "Giao hàng sai địa chỉ nhiều lần, sản phẩm bị hỏng hoàn toàn.",
                    "Chất lượng cực kỳ thấp, thiết kế không đẹp, giá cả không hợp lý."
                ]
            }
        ];
        
        let totalReviews = 0;
        
        // Tạo reviews cho mỗi sản phẩm
        for (const product of products) {
            console.log(`Creating reviews for: ${product.name}`);
            
            // Tạo 5-12 reviews cho mỗi sản phẩm
            const numReviews = Math.floor(Math.random() * 8) + 5;
            
            for (let i = 0; i < numReviews; i++) {
                // Chọn rating ngẫu nhiên (ưu tiên rating cao)
                const ratingGroup = Math.random() < 0.5 ? 0 : (Math.random() < 0.7 ? 1 : (Math.random() < 0.85 ? 2 : (Math.random() < 0.95 ? 3 : 4)));
                const ratingData = fakeReviews[ratingGroup];
                
                // Chọn comment ngẫu nhiên
                const comment = ratingData.comments[Math.floor(Math.random() * ratingData.comments.length)];
                
                // Chọn user ngẫu nhiên từ danh sách users thật
                const randomUser = users[Math.floor(Math.random() * users.length)];
                
                // Tạo review với cấu trúc đúng
                const review = {
                    productID: product._id,
                    userID: randomUser._id, // Chỉ lưu ObjectId của user
                    rating: ratingData.rating,
                    comment: comment,
                    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date trong 90 ngày qua
                    updatedAt: new Date()
                };
                
                await db.collection('reviews').insertOne(review);
                totalReviews++;
            }
        }
        
        console.log(`✅ Created ${totalReviews} fixed fake reviews`);
        
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
        
        console.log('🎉 Fake reviews fixed successfully!');
        
    } catch (error) {
        console.error('❌ Error fixing fake reviews:', error);
        throw error;
    }
};

const main = async () => {
    try {
        await connectForSeeding();
        await fixFakeReviews();
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
