import { ObjectId } from 'mongoose';
import { IClassError } from '../InterfaceClassError';

export interface ICategory {
	_id: ObjectId;
	name: string;
}

export type CategoryType = ICategory | null;

export interface ICategoryService extends IClassError {
	body: { name: string };
	category: ICategory | null;
	create(): Promise<void>;
	update(category_id: string): Promise<void | number>;
	valide(): Promise<void | number>;
}
