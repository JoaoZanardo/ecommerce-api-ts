import { Request, Response } from 'express';
import { IUser } from '../interfaces/user/userInterface';
import { Order } from '../services/OrderService';

export const checkoutAction = async (req: Request, res: Response) => {
	try {
		const user = req.user as IUser;

		const order = new Order(user._id.toString());
		await order.checkout();

		if (order.errors.length > 0) return res.json({ errors: order.errors });

		res.json({ order: order.order });
	} catch (e) {
		console.log(e);
	}
};

export const getList = async (req: Request, res: Response) => {
	try {
		const orderList = await Order.getList(req.query);

		res.json({ orderList });
	} catch (e) {
		console.log(e);
	}
};

export const getUserOrders = async (req: Request, res: Response) => {
	try {
		const user = req.user as IUser;

		const orders = await Order.getList({ user_id: user._id.toString() });
		if (!orders || orders.length <= 0)
			return res.json({ error: 'You have no orders yet' });

		res.json({ orders });
	} catch (e) {
		console.log(e);
	}
};

export const getInfo = async (req: Request, res: Response) => {
	try {
		const user = req.user as IUser;

		if (req.params.order_id.length !== 24)
			return res.json('Invalid order id');

		const order = new Order(user._id.toString());
		const orderInfo = await order.getInfo(req.params.order_id);

		if (order.errors.length > 0) return res.json({ errors: order.errors });

		res.json({ orderInfo });
	} catch (e) {
		console.log(e);
	}
};
