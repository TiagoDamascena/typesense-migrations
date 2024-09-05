import path from "path";
import { ConfigurationOptions } from "typesense/lib/Typesense/Configuration";
import {
  DEFAULT_MIGRATIONS_COLLECTION,
  DEFAULT_MIGRATIONS_FOLDER,
} from "./constants";

interface ConfigFile {
  folder?: string;
  collection?: string;
  client: ConfigurationOptions;
}

export interface Config {
  folder: string;
  collection: string;
  client: ConfigurationOptions;
}

const configPath = path.resolve(process.cwd(), 'typesense-migrations.js');
const configFile = require(configPath) as ConfigFile;

const config: Config = {
  folder: configFile.folder || DEFAULT_MIGRATIONS_FOLDER,
  collection: configFile.collection || DEFAULT_MIGRATIONS_COLLECTION,
  client: configFile.client || {},
};

export default config;