import { StatisticRepository } from './statistic.repository';
import { StatisticsSummary } from './statistic.model';
import { calculateAverageBmi, calculateMedian, findTopCountryByWinRatio } from './statistic.calculations.helper';

export class StatisticService {
  constructor(private readonly statisticRepository: StatisticRepository) {}

  async getSummary(): Promise<StatisticsSummary> {
    const playerStats = await this.statisticRepository.findAllPlayerStats();

    return {
      topCountryByWinRatio: findTopCountryByWinRatio(playerStats),
      averageBmi: calculateAverageBmi(playerStats),
      medianHeight: calculateMedian(playerStats.map((playerStat) => playerStat.heightCm)),
    };
  }
}
