import { ObjectId } from 'mongoose';
import { IClassError } from '../InterfaceClassError';

export interface IFilters {
	sort?: string;
	offset?: string;
	limit?: string;
	q?: string;
	cat?: string;
	state?: string;
	id?: string;
}

export interface IProduct {
	_id: ObjectId;
	category: string;
	title: string;
	description: string;
	price: number;
	images: { url: string; default: boolean }[];
	promotion: boolean;
	bestseller: boolean;
	stock: number;
	status: boolean;
	views: number;
	created_at: Date;
}

interface IProductServices extends IClassError {
	product: IProduct | null;
	body: IProduct;
}

export interface IProductService extends IProductServices {
	addAction(files: [Express.Multer.File]): Promise<void | number>;
	updateAction(
		product_id: string,
		files: Express.Multer.File[],
	): Promise<void | number>;
}

export interface IProductValide extends IProductServices {
	valide(files: Express.Multer.File[]): void;
}
