import { IUserBody } from '../interfaces/login/loginInterface';
import validator from 'validator';
import bcryptjs from 'bcrypt';
import { IUser, IUserService } from '../interfaces/user/userInterface';
import { UserModel } from '../models/UserModel';
import { Cart } from './CartService';

export class User implements IUserService {
	public user: IUser | null = null;
	public readonly errors: string[] = [];

	constructor(public readonly user_id: string) {}

	async update(body: IUserBody): Promise<void | number> {
		const user = await UserModel.findById(this.user_id);
		if (!user) return this.errors.push('User not found');

		await this.valideUpdate(body, user.password);
		if (this.errors.length > 0) return;

		await UserModel.findByIdAndUpdate(this.user_id, {
			name: body.name,
			email: body.email,
		});

		this.user = await UserModel.findById(this.user_id);
	}

	async valideUpdate(body: IUserBody, userPassword: string): Promise<void> {
		const user = await UserModel.findOne({ email: body.email });
		if (user && user.id !== this.user_id.toString())
			this.errors.push('Email already exists');

		if (!body.name) this.errors.push('Name is required');
		if (!body.email) this.errors.push('Email is required');
		if (body.email && !validator.isEmail(body.email))
			this.errors.push('Invalid Email');

		const password = await bcryptjs.compare(body.password, userPassword);
		if (!password) this.errors.push('Invalid password');
	}

	async delete(): Promise<void | number> {
		this.user = await UserModel.findByIdAndDelete(this.user_id);
		if (!this.user) return this.errors.push('User not found');
		const cart = await Cart.delete(this.user_id);
		if (!cart) return this.errors.push('User cart not found');
	}

	static async getList(): Promise<IUser[]> {
		return await UserModel.find();
	}
}
