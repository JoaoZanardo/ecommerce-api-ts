import mongoose from 'mongoose';
import { IUser } from '../interfaces/user/userInterface';

const UserSchema = new mongoose.Schema<IUser>({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	admin: { type: Boolean, required: true, default: false },
	created_at: { type: Date, required: true, default: new Date() },
});

export const UserModel = mongoose.model('User', UserSchema);
