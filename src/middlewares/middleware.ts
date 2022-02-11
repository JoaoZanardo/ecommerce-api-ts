import { ErrorRequestHandler } from 'express';
import { MulterError } from 'multer';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
	if (err instanceof MulterError) return res.json({ error: err.code });
	if (err.status) {
		res.status(err.status);
	} else {
		res.status(400);
	}
	if (err.message) {
		res.json(err.message);
	} else {
		res.json({ error: 'Something Is Wrong' });
	}
};
