const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/gomall', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Read JSON file
const readJSON = (filename) => {
    try {
        const filePath = path.join(__dirname, '..', '..', 'data', filename);
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`❌ Error reading ${filename}:`, error);
        return [];
    }
};

const createReviews = async () => {
    try {
        await connectDB();
        
        console.log('🗑️ Clearing existing reviews...');
        await mongoose.connection.db.collection('reviews').deleteMany({});
        console.log('✅ Cleared existing reviews');
        
        // Get products and users
        const products = await mongoose.connection.db.collection('products').find({}).toArray();
        const users = await mongoose.connection.db.collection('users').find({}).toArray();
        
        console.log(`📦 Found ${products.length} products`);
        console.log(`👥 Found ${users.length} users`);
        
        if (products.length === 0 || users.length === 0) {
            console.log('❌ No products or users found. Please run seed data first.');
            return;
        }
        
        // Read reviews data
        const reviewsData = readJSON('reviews.json');
        console.log(`📝 Found ${reviewsData.length} reviews to create`);
        
        // Create reviews
        const reviews = [];
        for (const reviewData of reviewsData) {
            // Find a random product
            const product = products[Math.floor(Math.random() * products.length)];
            
            // Find a random user
            const user = users[Math.floor(Math.random() * users.length)];
            
            if (product && user) {
                reviews.push({
                    productID: product._id,
                    userID: user._id,
                    rating: reviewData.rating,
                    comment: reviewData.comment,
                    createdAt: new Date(reviewData.createdAt),
                    updatedAt: new Date(reviewData.createdAt)
                });
            }
        }
        
        if (reviews.length > 0) {
            const result = await mongoose.connection.db.collection('reviews').insertMany(reviews);
            console.log(`✅ Created ${result.insertedCount} reviews`);
            
            // Update product ratings
            console.log('📊 Updating product ratings...');
            for (const product of products) {
                const productReviews = reviews.filter(r => r.productID.toString() === product._id.toString());
                if (productReviews.length > 0) {
                    const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
                    const roundedRating = Math.round(avgRating * 10) / 10;
                    
                    await mongoose.connection.db.collection('products').updateOne(
                        { _id: product._id },
                        { 
                            $set: { 
                                'rating.average': roundedRating,
                                'rating.count': productReviews.length
                            }
                        }
                    );
                    console.log(`📊 Updated ${product.name}: ${roundedRating}⭐ (${productReviews.length} reviews)`);
                }
            }
        }
        
        console.log('🎉 Reviews created successfully!');
        
    } catch (error) {
        console.error('❌ Error creating reviews:', error);
    } finally {
        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
    }
};

createReviews();
