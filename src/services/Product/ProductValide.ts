import {
	IProduct,
	IProductValide,
} from '../../interfaces/product/productInterface';
import { CategoryModel } from '../../models/CategoryModel';

export class ProductValide implements IProductValide {
	product: IProduct | null = null;

	constructor(readonly body: IProduct, readonly errors: string[]) {}
	async valide(files: Express.Multer.File[]): Promise<void> {
		await this.exists(this.body.category);
		if (!this.body.title) this.errors.push('Title is required');
		if (!this.body.price) this.errors.push('Price is required');
		if (!this.body.category) this.errors.push('Category is required');
		if (!this.body.stock) this.errors.push('Stock is required');
		if (files.length <= 0)
			this.errors.push('You need send at least 1 image');
	}

	async exists(category_id: string): Promise<void | number> {
		if (category_id.length !== 24)
			return this.errors.push('Category id is invalid');

		const category = await CategoryModel.findById(category_id);
		if (!category) this.errors.push('Category not found');
	}
}
