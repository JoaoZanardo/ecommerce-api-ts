import { Router } from 'express';
import * as orderController from '../controllers/orderController';
import { isAdmin, privateRoute } from '../config/passport';
const router = Router();

router.get('/checkout', privateRoute, orderController.checkoutAction);
router.get('/order', privateRoute, isAdmin, orderController.getList);
router.get('/order/user', privateRoute, orderController.getUserOrders);
router.get('/order/:order_id', privateRoute, orderController.getInfo);

export default router;
