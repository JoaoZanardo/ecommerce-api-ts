import mongoose from 'mongoose';
import { ICart } from '../interfaces/cart/cartInterface';

const CartSchema = new mongoose.Schema<ICart>({
	user_id: { type: String, required: true },
	products: { type: [Object], required: true },
});

export const CartModel = mongoose.model('Cart', CartSchema);
