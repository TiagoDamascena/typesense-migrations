import client from "../core/client";
import config from "../core/config";
import { ensureMigrationsCollectionExists } from "./collection";

interface Migration {
  name: string;
  batch: number;
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
