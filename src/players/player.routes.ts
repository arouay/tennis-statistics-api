import { Router } from 'express';
import { container } from '../container';
import { validate } from '../common/middleware/validate.middleware';
import { createPlayerBodySchema, getPlayerParamsSchema } from './player.schema';

const router = Router();
const playerController = container.resolve('playerController');

router.get('/', playerController.getAll);
router.get('/:id', validate('params', getPlayerParamsSchema), playerController.getById);
router.post('/', validate('body', createPlayerBodySchema), playerController.create);

export { router as playerRoutes };
