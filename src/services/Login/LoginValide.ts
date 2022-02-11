import { ILoginValide, IUserBody } from '../../interfaces/login/loginInterface';
import validator from 'validator';
import { UserModel } from '../../models/UserModel';
import { IUser } from '../../interfaces/user/userInterface';

export class LoginValide implements ILoginValide {
	public user: IUser | null = null;

	constructor(
		public readonly body: IUserBody,
		public readonly errors: string[],
	) {}

	async valide(): Promise<void> {
		await this.exists();
		if (this.body.password !== this.body.repeat_password)
			this.errors.push('The passwords do not math');
		if (!validator.isEmail(this.body.email))
			this.errors.push('Invalid Email');
		if (!this.body.name) this.errors.push('The name is required');
		if (this.body.password.length < 3 || this.body.password.length > 12)
			this.errors.push('password must be between 3 and 12 characters ');
	}

	async exists(): Promise<void> {
		this.user = await UserModel.findOne({ email: this.body.email });
		if (this.user) this.errors.push('This email is already registered');
	}
}
