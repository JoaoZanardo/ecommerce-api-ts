import { UserModel } from '../../models/UserModel';
import {
	ILoginService,
	IUserBody,
} from '../../interfaces/login/loginInterface';
import { LoginValide } from './LoginValide';
import bcryptjs from 'bcrypt';
import { IUser } from '../../interfaces/user/userInterface';
import { Cart } from '../CartService';

export class Login implements ILoginService {
	public readonly errors: string[] = [];
	public user: IUser | null = null;

	constructor(public readonly body: IUserBody) {}

	async signin(): Promise<void | number> {
		this.user = await UserModel.findOne({ email: this.body.email });
		if (!this.user) return this.errors.push('Invalid email or password'); //Number Type
		const password = await bcryptjs.compare(
			this.body.password,
			this.user.password,
		);
		if (!password) return this.errors.push('Invalid email or password');
	}

	async signup(): Promise<void | ILoginService> {
		const valide = new LoginValide(this.body, this.errors);
		await valide.valide();

		if (this.errors.length > 0) return;

		const salt = bcryptjs.genSaltSync();
		this.body.password = bcryptjs.hashSync(this.body.password, salt);

		this.user = await UserModel.create({
			name: this.body.name,
			email: this.body.email,
			password: this.body.password,
		});

		await Cart.create(this.user._id.toString());
	}
}
