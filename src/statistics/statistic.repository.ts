import { Statistic } from './statistic.model';

export class StatisticRepository {
  findAll(): Statistic[] {
    return [{ id: 'placeholder', playerId: 'placeholder' }];
  }
}
