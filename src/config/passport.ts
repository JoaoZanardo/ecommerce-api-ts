import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { UserModel } from '../models/UserModel';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IUser } from '../interfaces/user/userInterface';
dotenv.config();

const notAuthorizedJson = { status: 401, message: 'Not Authorized' };
const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_HASH as string,
};

passport.use(
	new JWTStrategy(options, async (payload, done) => {
		const user = await UserModel.findById(payload.id);
		if (!user) return done(notAuthorizedJson, null);

		return done(null, user);
	}),
);

export const privateRoute = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	passport.authenticate('jwt', (err, user: IUser | null) => {
		if (!user) return next(notAuthorizedJson);
		req.user = user;

		return next();
	})(req, res, next);
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
	passport.authenticate('jwt', (err, user: IUser | null) => {
		if (!user?.admin) return next(notAuthorizedJson);

		return next();
	})(req, res, next);
};

export const generateToken = (data: object) => {
	return jwt.sign(data, process.env.JWT_HASH as string);
};
