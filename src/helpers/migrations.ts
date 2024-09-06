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
    .export();

  return results.split('\n')
    .filter(Boolean)
    .map((migration) => JSON.parse(migration) as Migration) || [];
}

export async function runMigration(name: string, batch: number) {
  const folder = path.resolve(process.cwd(), config.folder);
  const migrationPath = path.join(folder, name);
  const migration = require(migrationPath) as MigrationFile;

  await migration.up(client);

  await client.collections<Migration>(config.collection).documents().create({
    migration: name,
    batch: batch,
  });
}

export async function rollbackMigration(name: string) {
  const folder = path.resolve(process.cwd(), config.folder);
  const migrationPath = path.join(folder, name);
  const migration = require(migrationPath) as MigrationFile;

  await migration.down(client);

  await client.collections<Migration>(config.collection).documents().delete({
    filter_by: `migration:=${name}`,
  });
}
