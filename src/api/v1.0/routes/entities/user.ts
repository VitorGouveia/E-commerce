import { Router } from 'express';
import {
	UserController,
	SessionController,
	DashboardController,
} from '@v1/controllers';

import { authenticate, dashAuthenticate, isIpBanned } from '../middlewares';

const router = Router();

router.post('/login', SessionController.create);
router.post('/admin/login', DashboardController.login);

router.post('/', isIpBanned, UserController.create);
router.get('/:id?', UserController.read);

router.patch('/:id?', authenticate, UserController.update);
router.delete('/:id?', authenticate, UserController.delete);

router.post('/address', authenticate, UserController.createAddress);
router.delete('/address/:id?', authenticate, UserController.deleteAddress);

router.post('/cart/:id?', authenticate, UserController.createCart);

router.post('/admin', dashAuthenticate, DashboardController.loadAdmin);
router.get('/ban/:id?', dashAuthenticate, DashboardController.banUser);
router.get('/invalidate/:id?', DashboardController.InvalidateToken);

export default router;
