import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/authenticate';
import { registerSchema, loginSchema, refreshSchema } from './auth.schema';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login',    validate(loginSchema),    AuthController.login);
router.post('/refresh',  validate(refreshSchema),  AuthController.refresh);
router.post('/logout',                             AuthController.logout);

// Protected route
router.get('/me', authenticate, AuthController.me);

export default router;

