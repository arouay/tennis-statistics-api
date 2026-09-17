import { pool } from '../config/database';
import { PlayerRepository } from './player.repository';

jest.mock('../config/database', () => ({
  pool: { query: jest.fn() },
}));

const mockedQuery = pool.query as jest.Mock;

const playerRow = {
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
};

const expectedPlayer = {
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
};

describe('PlayerRepository', () => {
  let repository: PlayerRepository;

  beforeEach(() => {
    repository = new PlayerRepository();
  });

  describe('findAll', () => {
    it('maps every row from the database into a Player', async () => {
      mockedQuery.mockResolvedValue({ rows: [playerRow] });

      const players = await repository.findAll();

      expect(players).toEqual([expectedPlayer]);
    });

    it('returns an empty array when there are no rows', async () => {
      mockedQuery.mockResolvedValue({ rows: [] });

      const players = await repository.findAll();

      expect(players).toEqual([]);
    });
  });

  describe('findById', () => {
    it('queries with the given id and returns the mapped Player when found', async () => {
      mockedQuery.mockResolvedValue({ rows: [playerRow] });

      const player = await repository.findById(52);

      expect(mockedQuery).toHaveBeenCalledWith(expect.any(String), [52]);
      expect(player).toEqual(expectedPlayer);
    });

    it('returns null when no row matches the id', async () => {
      mockedQuery.mockResolvedValue({ rows: [] });

      const player = await repository.findById(999999);

      expect(player).toBeNull();
    });
  });
});
