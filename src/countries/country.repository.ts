import { pool } from '../config/database';

export class CountryRepository {
  async exists(code: string): Promise<boolean> {
    const result = await pool.query('SELECT 1 FROM countries WHERE code = $1', [code]);
    return (result.rowCount ?? 0) > 0;
  }
}
