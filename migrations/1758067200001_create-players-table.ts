import { MigrationBuilder } from 'node-pg-migrate';

export function up(pgm: MigrationBuilder): void {
  pgm.createTable('players', {
    id: { type: 'integer', primaryKey: true },
    first_name: { type: 'text', notNull: true },
    last_name: { type: 'text', notNull: true },
    short_name: { type: 'text', notNull: true },
    sex: { type: 'char(1)', notNull: true, check: "sex IN ('M', 'F')" },
    picture: { type: 'text' },
    country_code: {
      type: 'varchar(3)',
      notNull: true,
      references: 'countries(code)',
    },
    birthdate: { type: 'date' },
  });

  pgm.createIndex('players', 'country_code');
}

export function down(pgm: MigrationBuilder): void {
  pgm.dropTable('players');
}
