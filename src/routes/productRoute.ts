import { Router } from 'express';
import * as productController from '../controllers/productController';
import { privateRoute, isAdmin } from '../config/passport';
import multer from 'multer';
const router = Router();

const options = multer({
	dest: 'tmp',
	fileFilter: (req, file, cb) => {
		const allowed = ['image/jpg', 'image/png', 'image/jpeg'];
		cb(null, allowed.includes(file.mimetype));
	},
	limits: { fieldSize: 2000000 },
});

router.get('/product', productController.getList);

router.get('/product/:product_id', productController.getInfo);

router.post(
	'/product',
	privateRoute,
	isAdmin,
	options.array('images', 10),
	productController.createAction,
);

router.delete(
	'/product/:product_id',
	privateRoute,
	isAdmin,
	productController.deleteAction,
);

router.post(
	'/product/:product_id',
	privateRoute,
	isAdmin,
	options.array('images', 10),
	productController.updateAction,
);

export default router;
