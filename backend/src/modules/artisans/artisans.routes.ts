import { Router } from 'express';
import { ArtisansController } from './artisans.controller';
import { authenticate } from '../../middlewares/authenticate';
import { validate } from '../../middlewares/validate';
import { updateArtisanSchema } from './artisans.schema';

const router = Router();

router.use(authenticate);

router.get('/',  ArtisansController.getProfile);
router.put('/',  validate(updateArtisanSchema), ArtisansController.updateProfile);

export default router;

