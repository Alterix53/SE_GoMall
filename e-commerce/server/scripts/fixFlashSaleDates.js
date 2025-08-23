#!/usr/bin/env node
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import connectDB from '../config/database.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/GoMall';

function daysFromNow(days) {
	const d = new Date();
	d.setDate(d.getDate() + days);
	return d;
}

(async () => {
	try {
		await connectDB(MONGODB_URI);
		console.log('Connected. Fixing flash sale dates...');

		const now = new Date();

		// 1) Ensure all products with isFlashSale = true have a future end date
		const fixResult = await Product.updateMany(
			{
				isFlashSale: true,
				$or: [
					{ flashSaleEndDate: { $exists: false } },
					{ flashSaleEndDate: null },
					{ flashSaleEndDate: { $lte: now } },
				],
			},
			{
				$set: { flashSaleEndDate: daysFromNow(7) },
			}
		);
		console.log(`Updated future end dates for ${fixResult.modifiedCount} flash sale products.`);

		// 2) Optionally promote some products into flash sale if none exist
		const existingCount = await Product.countDocuments({ isFlashSale: true, flashSaleEndDate: { $gt: now } });
		if (existingCount === 0) {
			console.log('No active flash sale products found; promoting top sellers into flash sale...');
			const candidates = await Product.find({ isActive: true }).sort({ sold: -1 }).limit(8);
			for (const p of candidates) {
				p.isFlashSale = true;
				// If no explicit flashSalePrice, take 10-20% off current sale price
				if (!p.flashSalePrice || p.flashSalePrice <= 0) {
					const base = (p.price?.sale || p.price?.original || 0);
					const discountFactor = 0.9 - Math.random() * 0.1; // between 0.8 and 0.9
					p.flashSalePrice = Math.round(base * discountFactor);
				}
				p.flashSaleEndDate = daysFromNow(7);
				await p.save();
			}
			console.log(`Promoted ${candidates.length} products to flash sale.`);
		}

		console.log('Done.');
		await mongoose.connection.close();
		process.exit(0);
	} catch (err) {
		console.error('Flash sale fix failed:', err);
		process.exit(1);
	}
})();
