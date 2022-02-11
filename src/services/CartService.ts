import { ICart, ICartService } from '../interfaces/cart/cartInterface';
import { IProduct } from '../interfaces/product/productInterface';
import { CartModel } from '../models/CartModel';
import { ProductModel } from '../models/ProductModel';
import { Product } from './Product/ProductService';

export class Cart implements ICartService {
	public readonly errors: string[] = [];

	constructor(
		public readonly user_id: string,
		public readonly product_id: string,
	) {}

	async addProduct(): Promise<number | IProduct | void> {
		const { product, cart } = (await this.valideAction()) as {
			product: IProduct;
			cart: ICart | any;
		};

		if (this.errors.length > 0) return;

		if (product.stock <= 0)
			return this.errors.push('Product with no stock');

		if (cart.products.length <= 0) {
			cart.products.push({ product_id: product._id.toString(), qtd: 1 });
			await cart.save();
			return product;
		}

		for (const i in cart.products) {
			if (cart.products[i].product_id === product._id.toString()) {
				if (cart.products[i].qtd >= product.stock)
					return this.errors.push(
						`There´s no more stock to '${product.title}', max: ${product.stock}`,
					);

				cart.products[i] = {
					product_id: product._id.toString(),
					qtd: cart.products[i].qtd + 1,
				};

				await cart.save();
				return product;
			}
		}

		cart.products.push({ product_id: product._id.toString(), qtd: 1 }); //Adding a new product
		await cart.save();

		return product;
	}

	async removeProduct(): Promise<number | IProduct | void> {
		const { product, cart } = (await this.valideAction()) as {
			product: IProduct;
			cart: ICart | any;
		};

		if (this.errors.length > 0) return;

		let hasThisProduct = false;

		if (cart.products.length <= 0)
			return this.errors.push(
				'You have no products to remove of your cart',
			);

		for (const i in cart.products) {
			if (cart.products[i].product_id === this.product_id) {
				hasThisProduct = true;
				cart.products.splice(parseInt(i), 1);
			}
		}
		await cart.save();

		if (hasThisProduct) return product;
		return this.errors.push('Has no this product in your cart');
	}

	async removeQtdProduct(): Promise<number | IProduct | void> {
		const { product, cart } = (await this.valideAction()) as {
			product: IProduct;
			cart: ICart | any;
		};

		if (this.errors.length > 0) return;

		let hasThisProduct = false;
		if (cart.products.length <= 0)
			return this.errors.push(
				'You have no products to remove of your cart',
			);

		for (const i in cart.products) {
			if (cart.products[i].product_id === this.product_id) {
				hasThisProduct = true;
				if (cart.products[i].qtd <= 1) {
					cart.products.splice(parseInt(i), 1);
				} else {
					cart.products[i] = {
						product_id: product._id.toString(),
						qtd: cart.products[i].qtd - 1,
					};
				}
			}
		}
		await cart.save();

		if (hasThisProduct) return product;
		return this.errors.push('Has no this product in your cart');
	}

	async valideAction(): Promise<number | { product: IProduct; cart: ICart }> {
		const product = await ProductModel.findById(this.product_id);
		const cart = await CartModel.findOne({ user_id: this.user_id });

		if (!product) return this.errors.push('Product not found');
		if (!cart) return this.errors.push('Cart not found');

		return { product, cart };
	}

	static async create(user_id: string): Promise<ICart | null> {
		return await CartModel.create({ user_id });
	}

	static async delete(user_id: string): Promise<ICart | null> {
		return await CartModel.findOneAndDelete({ user_id });
	}

	static async getInfo(user_id: string): Promise<void | object> {
		const cart = await CartModel.findOne({ user_id });
		if (!cart) return;

		const productsValided = [];
		for (const i of cart.products) {
			const product = await ProductModel.findById(i.product_id);

			if (!product || product.stock <= 0) {
				console.log('DELETED ITEM');
			} else if (i.qtd > product.stock) {
				const rightProduct = {
					product_id: i.product_id,
					qtd: product.stock,
				};
				productsValided.push(rightProduct);
			} else {
				productsValided.push(i);
			}
		}

		cart.products = productsValided;
		await cart.save();

		const products = [];
		let totalPrice = 0;
		for (const i of cart.products) {
			const product = await Product.getList({
				id: i.product_id,
				limit: cart.products.length.toString(),
			});

			totalPrice += product[0].price * i.qtd;
			products.push({ ...product[0], qtd: i.qtd });
		}

		return { _id: cart._id, user_id: cart.user_id, products, totalPrice };
	}
}
