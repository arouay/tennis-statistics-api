import { pool } from '../config/database';
import { PlayerRepository } from './player.repository';

jest.mock('../config/database', () => ({
  pool: { query: jest.fn() },
}));

const mockedQuery = pool.query as jest.Mock;

describe('PlayerRepository', () => {
  let repository: PlayerRepository;

  beforeEach(() => {
    repository = new PlayerRepository();
  });

  describe('findAll', () => {
    it('maps every row from the database into a Player', async () => {
      mockedQuery.mockResolvedValue({
        rows: [
          {
            id: 52,
            first_name: 'Novak',
            last_name: 'Djokovic',
            short_name: 'N.DJO',
            sex: 'M',
            picture: 'https://tenisu.latelier.co/resources/Djokovic.png',
            country_code: 'SRB',
            country_picture: 'https://tenisu.latelier.co/resources/Serbie.png',
            points: 2542,
            weight_grams: 80000,
            height_cm: 188,
            last_results: [1, 1, 1, 1, 1],
            rank: 2,
            age: null,
          },
        ],
      });

      const players = await repository.findAll();

      expect(players).toEqual([
        {
          id: 52,
          firstName: 'Novak',
          lastName: 'Djokovic',
          shortName: 'N.DJO',
          sex: 'M',
          picture: 'https://tenisu.latelier.co/resources/Djokovic.png',
          country: {
            code: 'SRB',
            picture: 'https://tenisu.latelier.co/resources/Serbie.png',
          },
          data: {
            rank: 2,
            points: 2542,
            weight: 80000,
            height: 188,
            age: null,
            last: [1, 1, 1, 1, 1],
          },
        },
      ]);
    });

    it('returns an empty array when there are no rows', async () => {
      mockedQuery.mockResolvedValue({ rows: [] });

      const players = await repository.findAll();

      expect(players).toEqual([]);
    });
  });
});
