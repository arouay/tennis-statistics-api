import { pool } from '../config/database';
import { StatisticRepository } from './statistic.repository';

jest.mock('../config/database', () => ({
  pool: { query: jest.fn() },
}));

const mockedQuery = pool.query as jest.Mock;

describe('StatisticRepository', () => {
  let repository: StatisticRepository;

  beforeEach(() => {
    repository = new StatisticRepository();
  });

  describe('findAllPlayerStats', () => {
    it('maps every row into a PlayerStat', async () => {
      mockedQuery.mockResolvedValue({
        rows: [
          {
            country_code: 'SRB',
            country_picture: 'https://tenisu.latelier.co/resources/Serbie.png',
            weight_grams: 80000,
            height_cm: 188,
            last_results: [1, 1, 1, 1, 1],
          },
        ],
      });

      const rows = await repository.findAllPlayerStats();

      expect(rows).toEqual([
        {
          country: { code: 'SRB', picture: 'https://tenisu.latelier.co/resources/Serbie.png' },
          weightGrams: 80000,
          heightCm: 188,
          lastResults: [1, 1, 1, 1, 1],
        },
      ]);
    });

    it('returns an empty array when there are no players', async () => {
      mockedQuery.mockResolvedValue({ rows: [] });

      const rows = await repository.findAllPlayerStats();

      expect(rows).toEqual([]);
    });
  });
});
