import { pool } from '../config/database';
import { User } from './user.model';

interface UserRow {
  id: number;
  email: string;
  keycloak_id: string;
}

export class UserRepository {
  async findByKeycloakId(keycloakId: string): Promise<User | null> {
    const result = await pool.query<UserRow>('SELECT id, email, keycloak_id FROM users WHERE keycloak_id = $1', [
      keycloakId,
    ]);

    const row = result.rows[0];
    return row ? { id: row.id, email: row.email, keycloakId: row.keycloak_id } : null;
  }
}
