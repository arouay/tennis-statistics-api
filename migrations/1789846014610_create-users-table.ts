import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    CREATE TABLE users (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      email text NOT NULL UNIQUE,
      keycloak_id uuid NOT NULL UNIQUE
    );
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('users');
}
