import { Request, Response } from 'express';
import { Category } from '../services/Category/CategoryService';

export const createAction = async (req: Request, res: Response) => {
	try {
		const category = new Category(req.body);
		await category.create();

		if (category.errors.length > 0 || !category.category)
			return res.json({ errors: category.errors });

		res.json({
			category: {
				_id: category.category._id,
				name: category.category.name,
			},
		});
	} catch (e) {
		console.log(e);
	}
};

export const deleteAction = async (req: Request, res: Response) => {
	try {
		if (req.params.category_id.length !== 24) return res.json('Invalid id');

		const category = await Category.delete(req.params.category_id);
		if (!category) return res.json('Category not found');

		res.json(`Category '${category.name}' deleted succesfully`);
	} catch (e) {
		console.log(e);
	}
};

export const updateAction = async (req: Request, res: Response) => {
	try {
		if (req.params.category_id.length !== 24) return res.json('Invalid id');
		const category = new Category(req.body);
		await category.update(req.params.category_id);

		if (category.errors.length > 0 || !category.category)
			return res.json({ errors: category.errors });

		res.json({
			category: {
				_id: category.category._id,
				name: category.category.name,
			},
		});
	} catch (e) {
		console.log(e);
	}
};

export const getInfo = async (req: Request, res: Response) => {
	try {
		if (req.params.category_id.length !== 24) return res.json('Invalid id');
		const category = await Category.getInfo(req.params.category_id);

		if (!category) return res.json({ errors: 'Category not found' });

		res.json({
			category: {
				_id: category._id,
				name: category.name,
			},
		});
	} catch (e) {
		console.log(e);
	}
};

export const getList = async (req: Request, res: Response) => {
	try {
		const categories = await Category.getList();
		res.json({ categories });
	} catch (e) {
		console.log(e);
	}
};
