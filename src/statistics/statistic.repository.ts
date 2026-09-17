import { pool } from '../config/database';
import { PlayerStat } from './statistic.model';

interface PlayerStatRow {
  country_code: string;
  country_picture: string;
  weight_grams: number;
  height_cm: number;
  last_results: number[];
}

export class StatisticRepository {
  async findAllPlayerStats(): Promise<PlayerStat[]> {
    const result = await pool.query<PlayerStatRow>(`
      SELECT c.code AS country_code, c.picture AS country_picture,
             s.weight_grams, s.height_cm, s.last_results
      FROM players p
      JOIN countries c ON c.code = p.country_code
      JOIN player_statistics s ON s.player_id = p.id
    `);

    return result.rows.map((row) => ({
      country: { code: row.country_code, picture: row.country_picture },
      weightGrams: row.weight_grams,
      heightCm: row.height_cm,
      lastResults: row.last_results,
    }));
  }
}
