import { Request, Response } from 'express';
import { IProduct } from '../interfaces/product/productInterface';
import { IUser } from '../interfaces/user/userInterface';
import { Cart } from '../services/CartService';

export const addProduct = async (req: Request, res: Response) => {
	try {
		if (req.params.product_id.length !== 24)
			return res.json('Invalid product id');

		const user = req.user as IUser;
		const cart = new Cart(user._id.toString(), req.params.product_id);
		const product = (await cart.addProduct()) as IProduct; //Return the title of the product that was added

		if (cart.errors.length > 0 || !product)
			return res.json({ errors: cart.errors });

		res.json(
			`The product '${product.title}' was added to your cart successfully`,
		);
	} catch (e) {
		console.log(e);
	}
};

export const removeProduct = async (req: Request, res: Response) => {
	try {
		if (req.params.product_id.length !== 24)
			return res.json('Invalid product id');

		const user = req.user as IUser;
		const cart = new Cart(user._id.toString(), req.params.product_id);
		const product = (await cart.removeProduct()) as IProduct; //Return the title of the product that was deleted

		if (cart.errors.length > 0 || !product)
			return res.json({ error: cart.errors });

		res.json(`The product '${product.title}' was removed from your cart`);
	} catch (e) {
		console.log(e);
	}
};

export const removeQtdProduct = async (req: Request, res: Response) => {
	try {
		const user = req.user as IUser;

		const cart = new Cart(user._id.toString(), req.params.product_id);
		const product = (await cart.removeQtdProduct()) as IProduct; //Return the title of the product that was deleted

		if (cart.errors.length > 0) return res.json({ errors: cart.errors });

		res.json(
			`One quantity of '${product.title}' was remove from from your cart`,
		);
	} catch (e) {
		console.log(e);
	}
};

export const getInfo = async (req: Request, res: Response) => {
	try {
		const user = req.user as IUser;

		const cart = await Cart.getInfo(user._id.toString());
		if (!cart) return res.json({ error: 'Cart not found' });

		res.json({ cart });
	} catch (e) {
		console.log(e);
	}
};
