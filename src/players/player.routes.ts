import { Router } from 'express';
import { container } from '../container';
import { validate } from '../common/middleware/validate.middleware';
import { getPlayerParamsSchema } from './player.schema';

const router = Router();
const playerController = container.resolve('playerController');

router.get('/', playerController.getAll);
router.get('/:id', validate('params', getPlayerParamsSchema), playerController.getById);

export { router as playerRoutes };
