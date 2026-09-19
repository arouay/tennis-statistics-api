import { pool } from '../src/config/database';

if (process.env.NODE_ENV === 'production') {
  console.error('Refusing to run seed script with NODE_ENV=production');
  process.exit(1);
}

const users = [{ email: 'arouay.arouay@gmail.com', keycloakId: '436702ee-c8b7-4f18-b119-f0f97871d65c' }];

async function seed(): Promise<void> {
  for (const user of users) {
    await pool.query(
      `INSERT INTO users (email, keycloak_id)
       VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET keycloak_id = EXCLUDED.keycloak_id`,
      [user.email, user.keycloakId],
    );
  }

  await pool.end();
}

seed().catch((err) => {
  console.error('Seed failed', err);
  process.exit(1);
});
