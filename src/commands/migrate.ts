import path from 'path';
import fs from 'fs';
import config from '../core/config';
import { getExecutedMigrations, runMigration } from '../helpers/migrations';

export const command: string = 'migrate';
export const desc: string = 'Run pending migrations';

export const handler = async (): Promise<void> => {
  const executedMigrations = await getExecutedMigrations();

  const batch = executedMigrations.reduce((acc, m) => Math.max(acc, m.batch), 0) + 1;

  const folder = path.resolve(process.cwd(), config.folder);
  const migrationFiles = fs.readdirSync(folder)
    .filter((file) => file.endsWith('.js'));

  let count = 0;
  for (const file of migrationFiles) {
    if (!executedMigrations.some((m) => m.migration === file)) {
      process.stdout.write(`Running migration: ${file}\n`);
      await runMigration(file, batch);
      process.stdout.write(`Migration completed: ${file}\n`);
      count++;
    }
  }

  if (count === 0) {
    process.stdout.write('No pending migrations to run, everything is up to date\n');
  } else {
    process.stdout.write(`Migration proccess completed: ${count} migrations executed\n`);
  }

  process.exit(0);
};
