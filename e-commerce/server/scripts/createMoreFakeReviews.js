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

const createMoreFakeReviews = async () => {
    try {
        console.log('Adding more fake reviews...');
        
        const db = mongoose.connection.db;
        
        // Lấy danh sách sản phẩm
        const products = await db.collection('products').find({}).toArray();
        console.log(`Found ${products.length} products`);
        
        // Đánh giá ảo đa dạng hơn
        const diverseReviews = [
            // 5 sao - Rất hài lòng
            {
                rating: 5,
                comments: [
                    "Sản phẩm vượt quá mong đợi! Chất lượng tuyệt vời, thiết kế đẹp mắt. Đáng mua 100%!",
                    "Tôi đã mua nhiều sản phẩm tương tự nhưng đây là sản phẩm tốt nhất. Rất hài lòng!",
                    "Chất lượng cao cấp, giá cả hợp lý. Shop giao hàng rất nhanh và đóng gói cẩn thận.",
                    "Sản phẩm đẹp, chất lượng tốt, giá cả phải chăng. Sẽ mua lại và giới thiệu cho bạn bè!",
                    "Tuyệt vời! Đúng như quảng cáo. Chất lượng không thua kém gì hàng chính hãng.",
                    "Rất hài lòng với sản phẩm này. Thiết kế hiện đại, chất lượng bền bỉ.",
                    "Sản phẩm chất lượng cao, đóng gói đẹp, giao hàng nhanh. Cảm ơn shop!",
                    "Đây là lần mua hàng online hài lòng nhất của tôi. Sản phẩm tuyệt vời!",
                    "Chất lượng xuất sắc, thiết kế độc đáo. Rất đáng tiền và đáng mua!",
                    "Sản phẩm hoàn hảo! Không có gì để chê trách. Shop phục vụ rất tốt!"
                ]
            },
            // 4 sao - Hài lòng
            {
                rating: 4,
                comments: [
                    "Sản phẩm tốt, chất lượng đúng như mô tả. Chỉ hơi chậm một chút trong việc giao hàng.",
                    "Chất lượng tốt, thiết kế đẹp. Có thể cải thiện thêm về mặt bao bì.",
                    "Sản phẩm đẹp, giá cả hợp lý. Shop phục vụ khách hàng rất tốt.",
                    "Hài lòng với chất lượng sản phẩm. Giao hàng đúng hẹn, đóng gói cẩn thận.",
                    "Sản phẩm tốt, thiết kế hiện đại. Có thể cải thiện thêm về mặt giá cả.",
                    "Chất lượng ổn, thiết kế đẹp. Shop giao hàng nhanh và nhiệt tình.",
                    "Sản phẩm đúng như mô tả, chất lượng tốt. Có thể cải thiện thêm về dịch vụ.",
                    "Hài lòng với việc mua hàng. Sản phẩm chất lượng, giá cả phải chăng.",
                    "Thiết kế đẹp, chất lượng tốt. Shop phục vụ khách hàng rất chu đáo.",
                    "Sản phẩm tốt, đúng như quảng cáo. Có thể cải thiện thêm về mặt giao hàng."
                ]
            },
            // 3 sao - Tạm được
            {
                rating: 3,
                comments: [
                    "Sản phẩm ổn, nhưng có thể cải thiện thêm về mặt thiết kế và chất liệu.",
                    "Chất lượng trung bình, giá cả hợp lý. Có thể cải thiện thêm về mặt dịch vụ.",
                    "Sản phẩm đúng như mô tả, nhưng giao hàng hơi chậm so với dự kiến.",
                    "Thiết kế đẹp, nhưng chất liệu có thể cải thiện thêm để tăng độ bền.",
                    "Sản phẩm ổn, nhưng có thể cải thiện về mặt bao bì và hướng dẫn sử dụng.",
                    "Chất lượng trung bình, thiết kế đơn giản. Có thể cải thiện thêm về mặt giá cả.",
                    "Sản phẩm đúng như quảng cáo, nhưng có thể cải thiện thêm về mặt chất lượng.",
                    "Thiết kế đẹp, nhưng độ bền cần cải thiện thêm để xứng đáng với giá tiền.",
                    "Sản phẩm ổn, nhưng có thể cải thiện về mặt dịch vụ khách hàng.",
                    "Chất lượng trung bình, giá cả phải chăng. Có thể cải thiện thêm về mặt thiết kế."
                ]
            },
            // 2 sao - Không hài lòng
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
            // 1 sao - Rất không hài lòng
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
        
        // Tên người dùng ảo đa dạng
        const fakeUserNames = [
            "Nguyễn Văn An", "Trần Thị Bình", "Lê Văn Cường", "Phạm Thị Dung",
            "Hoàng Văn Em", "Vũ Thị Phương", "Đặng Văn Giang", "Bùi Thị Hoa",
            "Ngô Văn Khoa", "Lý Thị Lan", "Võ Văn Minh", "Đỗ Thị Nga",
            "Hồ Văn Phúc", "Dương Thị Quỳnh", "Tô Văn Sinh", "Lưu Thị Trang",
            "Đinh Văn Uy", "Mai Thị Vân", "Lâm Văn Xuân", "Hà Thị Yến",
            "Trịnh Văn Bảo", "Lê Thị Cẩm", "Vũ Văn Đức", "Nguyễn Thị Hương",
            "Phạm Văn Kiên", "Trần Thị Lệ", "Hoàng Văn Nam", "Đặng Thị Oanh",
            "Bùi Văn Phát", "Lý Thị Quế", "Võ Văn Rồng", "Đỗ Thị Sinh"
        ];
        
        let additionalReviews = 0;
        
        // Thêm reviews cho mỗi sản phẩm
        for (const product of products) {
            console.log(`Adding more reviews for: ${product.name}`);
            
            // Thêm 2-5 reviews nữa cho mỗi sản phẩm
            const numAdditionalReviews = Math.floor(Math.random() * 4) + 2;
            
            for (let i = 0; i < numAdditionalReviews; i++) {
                // Chọn rating ngẫu nhiên (ưu tiên rating cao)
                const ratingGroup = Math.random() < 0.5 ? 0 : (Math.random() < 0.7 ? 1 : (Math.random() < 0.85 ? 2 : (Math.random() < 0.95 ? 3 : 4)));
                const ratingData = diverseReviews[ratingGroup];
                
                // Chọn comment ngẫu nhiên
                const comment = ratingData.comments[Math.floor(Math.random() * ratingData.comments.length)];
                
                // Tạo user ảo
                const fakeUserName = fakeUserNames[Math.floor(Math.random() * fakeUserNames.length)];
                
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
                    createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000), // Random date trong 180 ngày qua
                    updatedAt: new Date()
                };
                
                await db.collection('reviews').insertOne(review);
                additionalReviews++;
            }
        }
        
        console.log(`✅ Added ${additionalReviews} additional fake reviews`);
        
        // Cập nhật lại rating trung bình cho tất cả sản phẩm
        console.log('Updating all product ratings...');
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
        
        console.log('🎉 Additional fake reviews created successfully!');
        
    } catch (error) {
        console.error('❌ Error creating additional fake reviews:', error);
        throw error;
    }
};

const main = async () => {
    try {
        await connectForSeeding();
        await createMoreFakeReviews();
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
