import path from "path";
import client from "../core/client";
import config from "../core/config";
import { ensureMigrationsCollectionExists } from "./collection";
import { Client } from "typesense";

interface Migration {
  migration: string;
  batch: number;
}

interface MigrationFile {
  up: (client: Client) => Promise<void>;
  down: (client: Client) => Promise<void>;
}

export async function getExecutedMigrations() {
  await ensureMigrationsCollectionExists();
  const results = await client.collections<Migration>(config.collection)
    .documents()
    .search({
      q: '*',
      query_by: 'migration',
    });

  return results.hits?.map(hit => hit.document) || [];
}

export async function runMigration(name: string, batch: number) {
  const folder = path.resolve(process.cwd(), config.folder);
  const migrationPath = path.join(folder, name);
  const migration = require(migrationPath) as MigrationFile;

  await migration.up(client);

  await client.collections<Migration>(config.collection).documents().create({
    migration: name,
    batch: 1,
  });
}
