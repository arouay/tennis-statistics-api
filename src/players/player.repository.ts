import { pool } from '../config/database';
import { Player } from './player.model';
import { Sex } from '../common/constants';

interface PlayerRow {
  id: number;
  first_name: string;
  last_name: string;
  short_name: string;
  sex: Sex;
  picture: string | null;
  country_code: string;
  country_picture: string;
  points: number;
  weight_grams: number;
  height_cm: number;
  last_results: number[];
  rank: number;
  age: number | null;
}

export class PlayerRepository {
  async findAll(): Promise<Player[]> {
    const result = await pool.query<PlayerRow>(`
      SELECT
        p.id, p.first_name, p.last_name, p.short_name, p.sex, p.picture,
        c.code AS country_code, c.picture AS country_picture,
        s.points, s.weight_grams, s.height_cm, s.last_results,
        RANK() OVER (ORDER BY s.points DESC)::int AS rank,
        CASE WHEN p.birthdate IS NOT NULL
             THEN DATE_PART('year', AGE(p.birthdate))::int
             ELSE NULL END AS age
      FROM players p
      JOIN countries c ON c.code = p.country_code
      JOIN player_statistics s ON s.player_id = p.id
      ORDER BY s.points DESC
    `);

    return result.rows.map((row) => this.toPlayer(row));
  }

  async findById(id: number): Promise<Player | null> {
    const result = await pool.query<PlayerRow>(
      `
      SELECT * FROM (
        SELECT
          p.id, p.first_name, p.last_name, p.short_name, p.sex, p.picture,
          c.code AS country_code, c.picture AS country_picture,
          s.points, s.weight_grams, s.height_cm, s.last_results,
          RANK() OVER (ORDER BY s.points DESC)::int AS rank,
          CASE WHEN p.birthdate IS NOT NULL
               THEN DATE_PART('year', AGE(p.birthdate))::int
               ELSE NULL END AS age
        FROM players p
        JOIN countries c ON c.code = p.country_code
        JOIN player_statistics s ON s.player_id = p.id
      ) ranked
      WHERE id = $1
    `,
      [id],
    );

    const row = result.rows[0];
    return row ? this.toPlayer(row) : null;
  }

  private toPlayer(row: PlayerRow): Player {
    return {
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      shortName: row.short_name,
      sex: row.sex,
      picture: row.picture,
      country: {
        code: row.country_code,
        picture: row.country_picture,
      },
      data: {
        rank: row.rank,
        points: row.points,
        weight: row.weight_grams,
        height: row.height_cm,
        age: row.age,
        last: row.last_results,
      },
    };
  }
}
