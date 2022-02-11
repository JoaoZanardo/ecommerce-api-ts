import { Request, Response } from 'express';
import { Product } from '../services/Product/ProductService';

export const createAction = async (req: Request, res: Response) => {
	try {
		const product = new Product(req.body);
		await product.addAction(req.files as Express.Multer.File[]);

		if (product.errors.length > 0)
			return res.json({ errors: product.errors });

		res.json(`Product '${product.product?.title}' created succesfully`);
	} catch (e) {
		console.log(e);
	}
};

export const deleteAction = async (req: Request, res: Response) => {
	try {
		if (req.params.product_id.length !== 24)
			return res.json('Invalid product id');

		const product = await Product.deleteAction(req.params.product_id);

		if (!product) return res.json('Product not found');

		res.json(`Product '${product.title}' deleted successfully`);
	} catch (e) {
		console.log(e);
	}
};

export const updateAction = async (req: Request, res: Response) => {
	try {
		console.log(req.body);
		if (req.params.product_id.length !== 24)
			return res.json('Invalid product id');

		const product = new Product(req.body);
		await product.updateAction(
			req.params.product_id,
			req.files as Express.Multer.File[],
		);

		if (product.errors.length > 0)
			return res.json({ errors: product.errors });

		res.json(`Product '${product.product?.title}' edited succesfully`);
	} catch (e) {
		console.log(e);
	}
};

export const getInfo = async (req: Request, res: Response) => {
	try {
		if (req.params.product_id.length !== 24)
			return res.json('Invalid product id');

		const product = await Product.getInfo(req.params.product_id);
		if (!product) return res.json('Product not found');

		res.json(product);
	} catch (e) {
		console.log(e);
	}
};

export const getList = async (req: Request, res: Response) => {
	try {
		const products = await Product.getList(req.query);
		res.json(products);
	} catch (e) {
		console.log(e);
	}
};
