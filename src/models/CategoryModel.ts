import mongoose from 'mongoose';
import { ICategory } from '../interfaces/category/categoryInterface';

const CategorySchema = new mongoose.Schema<ICategory>({
	name: { type: String, required: true },
});

export const CategoryModel = mongoose.model('Category', CategorySchema);
