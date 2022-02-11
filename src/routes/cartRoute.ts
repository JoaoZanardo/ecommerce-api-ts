import { Router } from 'express';
import * as cartController from '../controllers/cartController';
import { privateRoute, isAdmin } from '../config/passport';
const router = Router();

router.get('/cart', privateRoute, cartController.getInfo);
router.get('/cart/:product_id', privateRoute, cartController.addProduct);
router.delete('/cart/:product_id', privateRoute, cartController.removeProduct);
router.delete(
	'/cart/qtd/:product_id',
	privateRoute,
	cartController.removeQtdProduct,
);

export default router;
