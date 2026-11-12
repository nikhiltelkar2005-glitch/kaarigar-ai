import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

router.use(authenticate);

router.get('/', DashboardController.getMetrics);

export default router;

