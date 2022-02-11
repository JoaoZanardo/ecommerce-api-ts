import { Router } from 'express';
import * as loginController from '../controllers/loginController';
import * as userController from '../controllers/userController';
import { privateRoute, isAdmin } from '../config/passport';
const router = Router();

router.post('/user/signup', loginController.signup);
router.post('/user/signin', loginController.signin);

router.delete(
	'/user/:user_id',
	privateRoute,
	isAdmin,
	userController.deleteAction,
);
router.get('/user/list', privateRoute, isAdmin, userController.getList);
router.get('/user/me', privateRoute, userController.getInfo);
router.put('/user/me', privateRoute, userController.updateAction);

export default router;
