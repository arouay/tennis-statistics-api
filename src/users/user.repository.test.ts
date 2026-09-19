import { pool } from '../config/database';
import { UserRepository } from './user.repository';

jest.mock('../config/database', () => ({
  pool: { query: jest.fn() },
}));

const mockedQuery = pool.query as jest.Mock;

describe('UserRepository', () => {
  let repository: UserRepository;

  beforeEach(() => {
    repository = new UserRepository();
  });

  describe('findByKeycloakId', () => {
    it('returns the mapped user when a row is found', async () => {
      mockedQuery.mockResolvedValue({
        rows: [{ id: 1, email: 'test.player@tennis-api.local', keycloak_id: '57bd530d-9f6c-4213-8560-d2b3cf7cc19b' }],
      });

      const user = await repository.findByKeycloakId('57bd530d-9f6c-4213-8560-d2b3cf7cc19b');

      expect(mockedQuery).toHaveBeenCalledWith(expect.any(String), ['57bd530d-9f6c-4213-8560-d2b3cf7cc19b']);
      expect(user).toEqual({ id: 1, email: 'test.player@tennis-api.local', keycloakId: '57bd530d-9f6c-4213-8560-d2b3cf7cc19b' });
    });

    it('returns null when no user matches the keycloak id', async () => {
      mockedQuery.mockResolvedValue({ rows: [] });

      const user = await repository.findByKeycloakId('unknown-id');

      expect(user).toBeNull();
    });
  });
});
