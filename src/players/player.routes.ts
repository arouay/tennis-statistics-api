import { Router } from 'express';
import { container } from '../container';

const router = Router();
const playerController = container.resolve('playerController');

router.get('/', playerController.getAll);

export { router as playerRoutes };
