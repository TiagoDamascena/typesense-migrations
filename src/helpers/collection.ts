import client from "../core/client";
import config from "../core/config";

export async function ensureMigrationsCollectionExists() {
  const collections = await client.collections().retrieve();
  const exists = collections.some((c) => c.name === config.collection);

  if (!exists) {
    await client.collections().create({
      name: config.collection,
      fields: [
        { name: 'migration', type: 'string' },
        { name: 'batch', type: 'int32' },
      ],
    });
  }
}
