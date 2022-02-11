import { ICart } from '../interfaces/cart/cartInterface';
import { IOrder, IOrderService } from '../interfaces/order/orderInterface';
import { CartModel } from '../models/CartModel';
import { OrderModel } from '../models/OrderModel';
import { OrderStatusModel } from '../models/OrderStatusModel';
import { ProductModel } from '../models/ProductModel';
import { UserModel } from '../models/UserModel';
import { Product } from './Product/ProductService';

export class Order implements IOrderService {
	public readonly errors: string[] = [];
	public order: IOrder | null = null;

	constructor(public readonly user_id: string) {}

	async checkout(): Promise<void> {
		const cart = await CartModel.findOne({ user_id: this.user_id });
		await this.verifyCheckout(cart);
		if (this.errors.length > 0) return;

		let totalPrice = 0;
		for (const i of cart!.products) {
			const product = await ProductModel.findById(i.product_id);

			totalPrice += product!.price * i.qtd;
		}

		this.order = await OrderModel.create({
			user_id: cart!.user_id,
			status: '62045fd7435e44f473f1b236',
			products: cart!.products,
			totalPrice,
		});

		await this.removeStockProduct(cart!.products);

		while (cart!.products.length > 0) {
			for (const i in cart!.products) {
				cart!.products.splice(parseInt(i), 1);
			}
		}

		await cart!.save();
	}

	async removeStockProduct(
		cart_products: { product_id: string; qtd: number }[],
	): Promise<void> {
		for (const i of cart_products) {
			const product = await ProductModel.findById(i.product_id);
			product!.stock = product!.stock - i.qtd;
			await product?.save();
		}
	}

	async verifyCheckout(cart: ICart | null | any): Promise<void | number> {
		if (!cart) return this.errors.push('This is a invalid cart');

		if (cart.products.length <= 0)
			return this.errors.push('You have nothing to order');

		for (const i in cart.products) {
			const product = await ProductModel.findById(
				cart.products[i].product_id,
			);
			if (!product || product.stock <= 0) {
				this.errors.push('Invalid products');
			} else if (cart.products[i].qtd > product.stock) {
				cart.products[i].qtd = product.stock;
			}
		}
		await cart.save();
	}

	async getInfo(order_id: string): Promise<number | object> {
		const rawOrder = await OrderModel.findById(order_id);
		if (!rawOrder) return this.errors.push('Order not found');
		if (rawOrder.user_id !== this.user_id)
			return this.errors.push('You can just see your orders');

		const user = await UserModel.findById(this.user_id);
		if (!user) return this.errors.push('Invalid user');

		const status = await OrderStatusModel.findById(rawOrder.status);
		if (!status) return this.errors.push('Invalid status');

		const products = [];
		for (const i of rawOrder.products) {
			const product = await Product.getList({
				id: i.product_id,
				limit: rawOrder.products.length.toString(),
			});
			products.push({ ...product[0], qtd: i.qtd });
		}
		return {
			user: {
				_id: user.id,
				name: user.name,
				email: user.email,
			},
			status: status.status,
			products,
			totalPrice: rawOrder.totalPrice,
		};
	}

	static async getList(query: {
		q?: string;
		status?: string;
		product_id?: string;
		category_id?: string;
		user_id?: string;
	}): Promise<object[] | void> {
		const { status, user_id } = query;

		let filters = {};

		if (status) {
			const orderStatus = await OrderStatusModel.findById(status);
			if (orderStatus) filters = { status };
		}

		if (user_id) {
			const user = await UserModel.findById(user_id);
			if (user) filters = { ...filters, user_id };
		}

		const rawProducts = await OrderModel.find(filters);

		const products = [];
		for (const i of rawProducts) {
			const orderStatus = await OrderStatusModel.findById(i.status);
			if (!orderStatus) return;

			products.push({
				_id: i.id,
				user_id: i.user_id,
				status: orderStatus.status,
				created_at: i.created_at,
				totalPrice: i.totalPrice,
			});
		}

		return products;
	}
}
