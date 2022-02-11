import { Router } from 'express';
import { privateRoute, isAdmin } from '../config/passport';
import * as categoryController from '../controllers/categoryController';
const router = Router();

router.get('/category/list', categoryController.getList);
router.get('/category/:category_id', categoryController.getInfo);
router.post(
	'/category',
	privateRoute,
	isAdmin,
	categoryController.createAction,
);
router.put(
	'/category/:category_id',
	privateRoute,
	isAdmin,
	categoryController.updateAction,
);
router.delete(
	'/category/:category_id',
	privateRoute,
	isAdmin,
	categoryController.deleteAction,
);

export default router;
