import { MigrationBuilder } from 'node-pg-migrate';

export function up(pgm: MigrationBuilder): void {
  pgm.createTable('countries', {
    code: { type: 'varchar(3)', primaryKey: true },
    picture: { type: 'text', notNull: true },
  });
}

export function down(pgm: MigrationBuilder): void {
  pgm.dropTable('countries');
}
