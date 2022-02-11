import mongoose from 'mongoose';
import { IOrderStatus } from '../interfaces/order/orderStatusInterface';

const OrderStatusSchema = new mongoose.Schema<IOrderStatus>({
	status: { type: String, required: true },
	color: { type: String, required: true },
});

export const OrderStatusModel = mongoose.model('Status', OrderStatusSchema);
