import { Request, Response } from 'express';
import { StatisticService } from './statistic.service';

export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  getAll = (req: Request, res: Response) => {
    res.json(this.statisticService.getAll());
  };
}
