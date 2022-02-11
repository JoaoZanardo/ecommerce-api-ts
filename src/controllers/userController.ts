import { Request, Response } from 'express';
import { IUser } from '../interfaces/user/userInterface';
import { User } from '../services/UserService';

export const deleteAction = async (req: Request, res: Response) => {
	try {
		if (req.params.user_id.length !== 24)
			return res.json({ error: 'Invalid user id ' });

		const user = new User(req.params.user_id);
		await user.delete();

		if (user.errors.length > 0) return res.json({ errors: user.errors });

		res.json(`Id (${user.user?._id}) deleted succesfully`);
	} catch (e) {
		console.log(e);
	}
};

export const updateAction = async (req: Request, res: Response) => {
	try {
		const user_info = req.user as IUser;

		const user = new User(user_info._id.toString());
		await user.update(req.body);

		if (user.errors.length > 0 || !user.user)
			return res.json({ errors: user.errors });

		res.json({
			user: {
				id: user.user._id,
				name: user.user.name,
				email: user.user.email,
			},
		});
	} catch (e) {
		console.log(e);
	}
};

export const getList = async (req: Request, res: Response) => {
	try {
		const rawUsers = await User.getList();

		const users = [];
		for (const i of rawUsers) {
			users.push({
				_id: i._id,
				name: i.name,
				email: i.email,
				admin: i.admin,
				created_at: i.created_at,
			});
		}

		res.json({ users });
	} catch (e) {
		console.log(e);
	}
};

export const getInfo = async (req: Request, res: Response) => {
	try {
		const user = req.user as IUser;

		if (!user) return res.json({ error: 'User not found' });

		console.log(user);
		res.json({
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (e) {
		console.log(e);
	}
};
