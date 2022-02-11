import { ObjectId } from 'mongoose';
import { ICart } from '../cart/cartInterface';
import { IClassError } from '../InterfaceClassError';

export interface IOrder {
	_id: ObjectId;
	user_id: string;
	status: string;
	products: [
		{
			product_id: string;
			qtd: number;
		},
	];
	totalPrice: number;
	created_at: Date;
}

export interface IOrderService extends IClassError {
	order: IOrder | null;
	readonly user_id: string;
	checkout(): Promise<void>;
	removeStockProduct(
		cart_products: { product_id: string; qtd: number }[],
	): Promise<void>;
	verifyCheckout(cart: ICart | null | any): Promise<void | number>;
	getInfo(order_id: string): Promise<number | object>;
}
