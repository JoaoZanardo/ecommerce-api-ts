import { ObjectId } from 'mongoose';
import { IUserBody } from '../login/loginInterface';
import { IClassError } from '../InterfaceClassError';

export interface IUser {
	_id: ObjectId;
	name: string;
	email: string;
	password: string;
	admin: boolean;
	created_at: Date;
}

export interface IUserService extends IClassError {
	user_id: ObjectId | string;
	user: IUser | null;
	update(body: IUserBody): Promise<void | number>;
	valideUpdate(body: IUserBody, userPassword: string): Promise<void>;
	delete(): Promise<void | number>;
}
