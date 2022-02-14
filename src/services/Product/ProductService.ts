import { unlink } from 'fs/promises';
import sharp from 'sharp';
import { Category } from '../CategoryService';
import { ProductValide } from './ProductValide';
import dotenv from 'dotenv';
import {
	IFilters,
	IProduct,
	IProductService,
} from '../../interfaces/product/productInterface';
import { ProductModel } from '../../models/ProductModel';
dotenv.config();

export class Product implements IProductService {
	public readonly errors: string[] = [];
	public product: IProduct | null = null;

	constructor(readonly body: IProduct) {}

	async addAction(files: Express.Multer.File[]): Promise<void | number> {
		const valide = new ProductValide(this.body, this.errors);
		await valide.valide(files);
		if (this.errors.length > 0) return;

		const images = [];
		for (const file of files) {
			images.push({ url: file.filename, default: false });
		}
		images[0].default = true;

		this.body.images = images;
		this.product = await ProductModel.create(this.body);

		for (const file of files) {
			await sharp(file.path)
				.resize(null, 1000)
				.toFormat('jpeg')
				.toFile(`./public/media/${file.filename}.jpg`);
			await unlink(file.path);
		}
	}

	async updateAction(
		product_id: string,
		files: Express.Multer.File[],
	): Promise<void | number> {
		this.product = await ProductModel.findById(product_id);
		if (!this.product) return this.errors.push('Product not found');

		const valide = new ProductValide(this.body, this.errors);
		await valide.valide(files);
		if (this.errors.length > 0) return;

		const images = [];
		for (const file of files) {
			const url: string = file.filename;
			images.push({ url, default: false });
		}
		images[0].default = true;

		this.body.images = images;
		await ProductModel.findByIdAndUpdate(product_id, this.body);

		for (const image of this.product.images) {
			await unlink(
				`C:/Users/Zanardo/Desktop/ecommerce-init-api/public/media/${image.url}.jpg`,
			);
		}

		for (const file of files) {
			await sharp(file.path)
				.resize(null, 1000)
				.toFormat('jpeg')
				.toFile(`./public/media/${file.filename}.jpg`);
			await unlink(file.path);
		}
	}

	static async deleteAction(product_id: string): Promise<void | IProduct> {
		const product = await ProductModel.findByIdAndDelete(product_id);
		if (!product) return;

		for (const image of product.images) {
			await unlink(
				`C:/Users/Zanardo/Desktop/ecommerce-init-api/public/media/${image.url}.jpg`,
			);
		}

		return product;
	}

	static async getInfo(product_id: string) {
		const product = await ProductModel.findById(product_id);
		if (!product) return;

		const images = [];
		for (const i of product.images) {
			images.push(`${process.env.BASE}/media/${i.url}.jpg`);
		}

		product.views++;
		await product.save();
		const category = await Category.getInfo(product.category);
		if (!category) return;

		const othersProducts = await this.getList({
			cat: category._id.toString(),
			limit: '5',
		});

		for (const i in othersProducts) {
			if (othersProducts[i]._id.toString() === product.id) {
				othersProducts.splice(parseInt(i), 1);
			}
		}

		return {
			product: {
				_id: product._id,
				category: category.name,
				title: product.title,
				description: product.description,
				price: product.price,
				images,
				promotion: product.promotion,
				bestseller: product.bestseller,
				// stock: product.stock,
				// status: product.status,
				// views: product.views,
				created_at: product.created_at,
			},
			othersProducts,
		};
	}

	static async getList(query: IFilters) {
		const { sort = 'asc', limit = '10', q, cat, id } = query;

		let filters = {};

		if (q) {
			filters = { title: { $regex: q, $options: 'i' } };
		}

		if (cat) {
			const category = await Category.getInfo(cat);
			if (category) filters = { ...filters, category: cat };
		}

		if (id) {
			const product = await ProductModel.findById(id);
			if (product) filters = { ...filters, _id: id };
		}

		const rawProducts = await ProductModel.find(filters)
			.sort({ created_at: sort === 'desc' ? -1 : 1 })
			.limit(parseInt(limit));

		const products = [];
		for (const i of rawProducts) {
			if (i.status) {
				const image = `${process.env.BASE}/media/${i.images[0].url}.jpg`;
				const category = await Category.getInfo(i.category);
				products.push({
					_id: i._id,
					category: category?.name,
					title: i.title,
					price: i.price,
					image,
				});
			}
		}

		return products;
	}
}
