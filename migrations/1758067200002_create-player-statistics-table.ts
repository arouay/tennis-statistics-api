import { MigrationBuilder } from 'node-pg-migrate';

export function up(pgm: MigrationBuilder): void {
  pgm.createTable('player_statistics', {
    player_id: {
      type: 'integer',
      primaryKey: true,
      references: 'players(id)',
      onDelete: 'CASCADE',
    },
    points: { type: 'integer', notNull: true },
    weight_grams: { type: 'integer', notNull: true },
    height_cm: { type: 'integer', notNull: true },
    last_results: {
      type: 'smallint[]',
      notNull: true,
      default: pgm.func("'{}'"),
      check: 'last_results <@ ARRAY[0, 1]::smallint[]',
    },
  });

  pgm.createIndex('player_statistics', [{ name: 'points', sort: 'DESC' }], {
    name: 'idx_player_statistics_points',
  });
}

export function down(pgm: MigrationBuilder): void {
  pgm.dropTable('player_statistics');
}
