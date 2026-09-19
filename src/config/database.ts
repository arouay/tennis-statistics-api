import { Pool } from 'pg';
import dotenv from 'dotenv';
import { logger } from '../common/logger';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected error on idle PostgreSQL client');
});

export { pool };
