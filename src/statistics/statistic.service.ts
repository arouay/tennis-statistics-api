import { StatisticRepository } from './statistic.repository';
import { Statistic } from './statistic.model';

export class StatisticService {
  constructor(private readonly statisticRepository: StatisticRepository) {}

  getAll(): Statistic[] {
    return this.statisticRepository.findAll();
  }
}
