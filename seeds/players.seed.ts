import { pool } from '../src/config/database';

if (process.env.NODE_ENV === 'production') {
  console.error('Refusing to run seed script with NODE_ENV=production');
  process.exit(1);
}

const countries = [
  { code: 'SRB', picture: 'https://tenisu.latelier.co/resources/Serbie.png' },
  { code: 'USA', picture: 'https://tenisu.latelier.co/resources/USA.png' },
  { code: 'SUI', picture: 'https://tenisu.latelier.co/resources/Suisse.png' },
  { code: 'ESP', picture: 'https://tenisu.latelier.co/resources/Espagne.png' },
];

const players = [
  {
    id: 52,
    firstName: 'Novak',
    lastName: 'Djokovic',
    shortName: 'N.DJO',
    sex: 'M',
    picture: 'https://tenisu.latelier.co/resources/Djokovic.png',
    countryCode: 'SRB',
    points: 2542,
    weightGrams: 80000,
    heightCm: 188,
    lastResults: [1, 1, 1, 1, 1],
  },
  {
    id: 95,
    firstName: 'Venus',
    lastName: 'Williams',
    shortName: 'V.WIL',
    sex: 'F',
    picture: 'https://tenisu.latelier.co/resources/Venus.webp',
    countryCode: 'USA',
    points: 1105,
    weightGrams: 74000,
    heightCm: 185,
    lastResults: [0, 1, 0, 0, 1],
  },
  {
    id: 65,
    firstName: 'Stan',
    lastName: 'Wawrinka',
    shortName: 'S.WAW',
    sex: 'M',
    picture: 'https://tenisu.latelier.co/resources/Wawrinka.png',
    countryCode: 'SUI',
    points: 1784,
    weightGrams: 81000,
    heightCm: 183,
    lastResults: [1, 1, 1, 0, 1],
  },
  {
    id: 102,
    firstName: 'Serena',
    lastName: 'Williams',
    shortName: 'S.WIL',
    sex: 'F',
    picture: 'https://tenisu.latelier.co/resources/Serena.png',
    countryCode: 'USA',
    points: 3521,
    weightGrams: 72000,
    heightCm: 175,
    lastResults: [0, 1, 1, 1, 0],
  },
  {
    id: 17,
    firstName: 'Rafael',
    lastName: 'Nadal',
    shortName: 'R.NAD',
    sex: 'M',
    picture: 'https://tenisu.latelier.co/resources/Nadal.png',
    countryCode: 'ESP',
    points: 1982,
    weightGrams: 85000,
    heightCm: 185,
    lastResults: [1, 0, 0, 0, 1],
  },
];

async function seed(): Promise<void> {
  for (const country of countries) {
    await pool.query(
      'INSERT INTO countries (code, picture) VALUES ($1, $2) ON CONFLICT (code) DO NOTHING',
      [country.code, country.picture],
    );
  }

  for (const player of players) {
    await pool.query(
      `INSERT INTO players (id, first_name, last_name, short_name, sex, picture, country_code)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO NOTHING`,
      [player.id, player.firstName, player.lastName, player.shortName, player.sex, player.picture, player.countryCode],
    );

    await pool.query(
      `INSERT INTO player_statistics (player_id, points, weight_grams, height_cm, last_results)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (player_id) DO NOTHING`,
      [player.id, player.points, player.weightGrams, player.heightCm, player.lastResults],
    );
  }

  console.log(`Seeded ${players.length} players`);
  await pool.end();
}

seed().catch((err) => {
  console.error('Seed failed', err);
  process.exit(1);
});
