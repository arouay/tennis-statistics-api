import { StatisticService } from './statistic.service';
import { StatisticRepository } from './statistic.repository';
import { PlayerStat } from './statistic.model';

const playerStats: PlayerStat[] = [
  {
    country: { code: 'SRB', picture: 'https://tenisu.latelier.co/resources/Serbie.png' },
    weightGrams: 80000,
    heightCm: 188,
    lastResults: [1, 1, 1, 1, 1],
  },
  {
    country: { code: 'ESP', picture: 'https://tenisu.latelier.co/resources/Espagne.png' },
    weightGrams: 85000,
    heightCm: 185,
    lastResults: [1, 0, 0, 0, 1],
  },
];

describe('StatisticService', () => {
  let repository: jest.Mocked<StatisticRepository>;
  let service: StatisticService;

  beforeEach(() => {
    repository = {
      findAllPlayerStats: jest.fn(),
    } as unknown as jest.Mocked<StatisticRepository>;
    service = new StatisticService(repository);
  });

  describe('getSummary', () => {
    it('composes the summary from the repository data using the real calculation functions', async () => {
      repository.findAllPlayerStats.mockResolvedValue(playerStats);

      const result = await service.getSummary();

      expect(result).toEqual({
        topCountryByWinRatio: { code: 'SRB', picture: 'https://tenisu.latelier.co/resources/Serbie.png', winRatio: 1 },
        averageBmi: 23.74,
        medianHeight: 186.5,
      });
    });

    it('returns null fields when there are no players', async () => {
      repository.findAllPlayerStats.mockResolvedValue([]);

      const result = await service.getSummary();

      expect(result).toEqual({
        topCountryByWinRatio: null,
        averageBmi: null,
        medianHeight: null,
      });
    });
  });
});
