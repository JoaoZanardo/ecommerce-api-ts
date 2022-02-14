import {
	CategoryType,
	ICategoryService,
} from '../interfaces/category/categoryInterface';
import { CategoryModel } from '../models/CategoryModel';

export class Category implements ICategoryService {
	public readonly errors: string[] = [];
	public category: CategoryType = null;

	constructor(public readonly body: { name: string }) {}

	async create(): Promise<void> {
		await this.valide();

		if (this.errors.length > 0) return;

		this.category = await CategoryModel.create({
			name: this.body.name,
		});
	}

	static async delete(category_id: string): Promise<CategoryType> {
		return await CategoryModel.findByIdAndDelete(category_id);
	}

	async update(category_id: string): Promise<void | number> {
		const category = await CategoryModel.findById(category_id);
		if (!category) return this.errors.push('Category not found');

		await this.valide();

		if (this.errors.length > 0) return;

		await CategoryModel.findByIdAndUpdate(category_id, {
			name: this.body.name,
		});

		this.category = await CategoryModel.findById(category_id);
	}

	static async getList(): Promise<CategoryType[]> {
		const rawCategories = await CategoryModel.find();

		const categories = [];
		for (const i of rawCategories) {
			categories.push({
				_id: i._id,
				name: i.name,
			});
		}

		return categories;
	}

	static async getInfo(category_id: string): Promise<CategoryType> {
		return await CategoryModel.findById(category_id);
	}

	async valide(): Promise<void | number> {
		if (!this.body.name)
			return this.errors.push('Category name is required');

		this.category = await CategoryModel.findOne({ name: this.body.name });
		if (this.category) this.errors.push('This category already exists');
	}
}
