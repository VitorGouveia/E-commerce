import { Router } from 'express';
import { UserController, SessionController, DashboardController } from '@v1/controllers';

import {
	authenticate,
	dashAuthenticate,
	isIpBanned,
	CreateUserRateLimiter,
	UpdateUserRateLimiter,
} from '../middlewares';

const router = Router();

router.post('/login', SessionController.create);
router.post('/admin/login', DashboardController.login);

router.post('/', [isIpBanned, CreateUserRateLimiter()], UserController.create);
router.post('/activate', UserController.activate);
router.get('/:id?', UserController.read);
router.patch('/:id?', [UpdateUserRateLimiter(), authenticate], UserController.update);
router.delete('/:id?', authenticate, UserController.delete);

router.post(
	'/forgot-password/:id?',
	[isIpBanned, UpdateUserRateLimiter()],
	UserController.forgotPassword
);

router.post('/address', authenticate, UserController.createAddress);
router.delete('/address/:id?', authenticate, UserController.deleteAddress);

router.post('/cart/:id?', authenticate, UserController.createCart);
router.delete('/cart/:id?', authenticate, UserController.deleteCart);

router.post('/admin', DashboardController.loadAdmin);
router.get('/ban/:id?', dashAuthenticate, DashboardController.banUser);
router.get('/invalidate/:id?', dashAuthenticate, DashboardController.InvalidateToken);

export default router;
