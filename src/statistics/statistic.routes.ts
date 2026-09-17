import { Router } from 'express';
import { container } from '../container';

const router = Router();
const statisticController = container.resolve('statisticController');

router.get('/', statisticController.getAll);

export { router as statisticRoutes };
