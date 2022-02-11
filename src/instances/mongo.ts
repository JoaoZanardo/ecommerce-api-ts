import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const mongoConnection = async () => {
	try {
		console.log('MONGO CONNECTED SUCCESSFULLY');
		return await mongoose.connect(process.env.MONGO_URL as string);
	} catch (e) {
		console.log(e);
	}
};
