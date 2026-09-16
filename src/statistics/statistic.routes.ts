import { Router } from 'express';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';
import { StatisticRepository } from './statistic.repository';

const router = Router();
const statisticController = new StatisticController(new StatisticService(new StatisticRepository()));

router.get('/', statisticController.getAll);

export { router as statisticRoutes };
