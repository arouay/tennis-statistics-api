import { pool } from '../config/database';
import { PlayerRepository } from './player.repository';
import { CreatePlayerInput } from './player.schema';

const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
};

jest.mock('../config/database', () => ({
  pool: { query: jest.fn(), connect: jest.fn() },
}));

const mockedQuery = pool.query as jest.Mock;
const mockedConnect = pool.connect as jest.Mock;

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

const createInput: CreatePlayerInput = {
  firstName: 'Serena',
  lastName: 'Williams',
  shortName: 'S.WIL',
  sex: 'F',
  picture: null,
  countryCode: 'USA',
  birthdate: null,
  points: 100,
  weightGrams: 72000,
  heightCm: 175,
  lastResults: [],
};

describe('PlayerRepository', () => {
  let repository: PlayerRepository;

  beforeEach(() => {
    repository = new PlayerRepository();
    mockedConnect.mockResolvedValue(mockClient);
    mockClient.query.mockReset().mockResolvedValue({});
    mockClient.release.mockReset();
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

  describe('create', () => {
    it('inserts the player and statistics in a transaction, then returns the reloaded player', async () => {
      mockClient.query
        .mockResolvedValueOnce({}) // BEGIN
        .mockResolvedValueOnce({ rows: [{ id: 52 }] }) // INSERT INTO players RETURNING id
        .mockResolvedValueOnce({}) // INSERT INTO player_statistics
        .mockResolvedValueOnce({}); // COMMIT
      mockedQuery.mockResolvedValue({ rows: [playerRow] });

      const player = await repository.create(createInput);

      expect(mockClient.query).toHaveBeenNthCalledWith(1, 'BEGIN');
      expect(mockClient.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('INSERT INTO players'),
        [
          createInput.firstName,
          createInput.lastName,
          createInput.shortName,
          createInput.sex,
          createInput.picture,
          createInput.countryCode,
          createInput.birthdate,
        ],
      );
      expect(mockClient.query).toHaveBeenNthCalledWith(
        3,
        expect.stringContaining('INSERT INTO player_statistics'),
        [52, createInput.points, createInput.weightGrams, createInput.heightCm, createInput.lastResults],
      );
      expect(mockClient.query).toHaveBeenNthCalledWith(4, 'COMMIT');
      expect(mockClient.release).toHaveBeenCalled();
      expect(player).toEqual(expectedPlayer);
    });

    it('rolls back and rethrows the error when an insert fails', async () => {
      const unexpected = new Error('connection lost');
      mockClient.query
        .mockReset()
        .mockResolvedValueOnce({}) // BEGIN
        .mockRejectedValueOnce(unexpected) // INSERT INTO players
        .mockResolvedValueOnce({}); // ROLLBACK

      await expect(repository.create(createInput)).rejects.toThrow(unexpected);
      expect(mockClient.query).toHaveBeenLastCalledWith('ROLLBACK');
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
});
