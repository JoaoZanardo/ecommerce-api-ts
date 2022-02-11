import { Request, Response } from 'express';
import { Login } from '../services/Login/LoginService';
import dotenv from 'dotenv';
import { generateToken } from '../config/passport';
dotenv.config();

export const signup = async (req: Request, res: Response) => {
	try {
		const login = new Login(req.body);
		await login.signup();

		if (login.errors.length > 0 || !login.user)
			return res.json({ errors: login.errors });

		const token = generateToken({ id: login.user._id });

		res.json({
			user: {
				id: login.user._id,
				name: login.user.name,
				email: login.user.email,
				created_at: login.user.created_at,
				token,
			},
		});
	} catch (e) {
		console.log(e);
	}
};

export const signin = async (req: Request, res: Response) => {
	try {
		const login = new Login(req.body);
		await login.signin();

		if (login.errors.length > 0 || !login.user)
			return res.json({ errors: login.errors });

		const token = generateToken({ id: login.user._id });

		res.json({
			user: {
				id: login.user._id,
				name: login.user.name,
				email: login.user.email,
				created_at: login.user.created_at,
				token,
			},
		});
	} catch (e) {
		console.log(e);
	}
};
