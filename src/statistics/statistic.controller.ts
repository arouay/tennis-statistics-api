import { Request, Response } from 'express';
import { StatisticService } from './statistic.service';

export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  getSummary = async (req: Request, res: Response) => {
    const summary = await this.statisticService.getSummary();
    res.json(summary);
  };
}
