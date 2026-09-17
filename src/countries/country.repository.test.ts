import { pool } from '../config/database';
import { CountryRepository } from './country.repository';

jest.mock('../config/database', () => ({
  pool: { query: jest.fn() },
}));

const mockedQuery = pool.query as jest.Mock;

describe('CountryRepository', () => {
  let repository: CountryRepository;

  beforeEach(() => {
    repository = new CountryRepository();
  });

  describe('exists', () => {
    it('returns true when a matching country row is found', async () => {
      mockedQuery.mockResolvedValue({ rowCount: 1 });

      const exists = await repository.exists('SRB');

      expect(mockedQuery).toHaveBeenCalledWith(expect.any(String), ['SRB']);
      expect(exists).toBe(true);
    });

    it('returns false when no matching country row is found', async () => {
      mockedQuery.mockResolvedValue({ rowCount: 0 });

      const exists = await repository.exists('XXX');

      expect(exists).toBe(false);
    });
  });
});
