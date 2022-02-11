import mongoose from 'mongoose';
import { IOrder } from '../interfaces/order/orderInterface';

const OrderSchema = new mongoose.Schema<IOrder>({
	user_id: { type: String, required: true },
	status: { type: String, required: true, default: 'pending' },
	products: { type: [Object], required: true },
	totalPrice: { type: Number, required: true },
	created_at: { type: Date, required: true, default: new Date() },
});

export const OrderModel = mongoose.model('Order', OrderSchema);
