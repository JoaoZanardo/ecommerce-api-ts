import mongoose from 'mongoose';
import { IProduct } from '../interfaces/product/productInterface';

const ProductSchema = new mongoose.Schema<IProduct>({
	category: { type: String, required: true },
	title: { type: String, required: true },
	description: { type: String },
	price: { type: Number, required: true },
	images: { type: [Object], required: true },
	promotion: { type: Boolean, default: false },
	bestseller: { type: Boolean, default: false },
	stock: { type: Number, required: true },
	status: { type: Boolean, required: true, default: true },
	views: { type: Number, required: true, default: 0 },
	created_at: { type: Date, required: true, default: new Date() },
});

export const ProductModel = mongoose.model('Product', ProductSchema);
