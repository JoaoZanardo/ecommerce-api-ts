import { IClassError } from '../InterfaceClassError';
import { IUser } from '../user/userInterface';

export interface IUserBody {
	name: string;
	email: string;
	password: string;
	repeat_password: string;
}

export interface ILogin extends IClassError {
	body: IUserBody;
	user: IUser | null;
}

export interface ILoginService extends ILogin {
	signup(): Promise<void | ILoginService>;
	signin(): Promise<void | number>;
}

export interface ILoginValide extends ILogin {
	valide(): Promise<void>;
	exists(): Promise<void>;
}
