import { getExecutedMigrations, rollbackMigration } from '../helpers/migrations';

export const command: string = 'rollback';
export const desc: string = 'Rollback the last migration batch';

export const handler = async (): Promise<void> => {
  const executedMigrations = await getExecutedMigrations();

  const lastBatch = executedMigrations.reduce((acc, m) => Math.max(acc, m.batch), 0);
  const lastBatchMigrations = executedMigrations.filter((m) => m.batch === lastBatch);

  let count = 0;
  for (const migration of lastBatchMigrations) {
    process.stdout.write(`Rolling back migration: ${migration.migration}\n`);
    await rollbackMigration(migration.migration);
    process.stdout.write(`Migration rolled back: ${migration.migration}\n`);
    count++;
  }

  if (count === 0) {
    process.stdout.write('No migrations to rollback\n');
  } else {
    process.stdout.write(`Migration rollback completed: ${count} migrations reverted\n`);
  }

  process.exit(0);
};
