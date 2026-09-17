import { Router } from 'express';
import { container } from '../container';

const router = Router();
const playerController = container.resolve('playerController');

router.get('/', playerController.getAll);
router.get('/:id', playerController.getById);

export { router as playerRoutes };
