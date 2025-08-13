import mongoose from 'mongoose';
import Product from '../models/Product.js';

const updateProductNames = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/gomall');
    console.log('Connected to MongoDB');

    const productUpdates = [
      {
        oldName: 'Điện thoại Samsung Galaxy S24',
        newName: 'Samsung Galaxy S24 Smartphone'
      },
      {
        oldName: 'Laptop Dell XPS 13',
        newName: 'Dell XPS 13 Laptop'
      },
      {
        oldName: 'MacBook Air M2',
        newName: 'MacBook Air M2 Laptop'
      },
      {
        oldName: 'Giày Sneaker Nike Air Max',
        newName: 'Nike Air Max Sneakers'
      },
      {
        oldName: 'Áo Hoodie Adidas',
        newName: 'Adidas Hoodie'
      },
      {
        oldName: 'Nồi Chiên Không Dầu Philips',
        newName: 'Philips Air Fryer'
      },
      {
        oldName: 'Kem Dưỡng Da Cetaphil',
        newName: 'Cetaphil Moisturizing Cream'
      },
      {
        oldName: 'Quần Short Jeans',
        newName: 'Denim Shorts'
      },
      {
        oldName: 'Máy Ép Hurom',
        newName: 'Hurom Slow Juicer'
      },
      {
        oldName: 'Túi Xách Gucci',
        newName: 'Gucci Handbag'
      }
    ];

    for (const update of productUpdates) {
      const result = await Product.updateOne(
        { name: update.oldName },
        { name: update.newName }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`Updated: ${update.oldName} -> ${update.newName}`);
      } else {
        console.log(`No product found with name: ${update.oldName}`);
      }
    }

    console.log('Product names updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateProductNames(); 