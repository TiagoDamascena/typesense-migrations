import path from 'path';
import fs from 'fs';
import type { Arguments, CommandBuilder } from 'yargs';
import config from '../core/config';

type Options = {
  name: string;
};

export const command: string = 'generate <name>';
export const desc: string = 'Generate a new migration file';

export const builder: CommandBuilder<Options, Options> = (yargs) => {
  return yargs
    .positional('name', { type: 'string', demandOption: true });
};

export const handler = (argv: Arguments<Options>): void => {
  const { name } = argv;

  const templatePath = path.resolve(__dirname, '../templates/migration.template.js');
  const template = fs.readFileSync(templatePath, 'utf-8');

  const folder = path.resolve(process.cwd(), config.folder);
  if (!fs.existsSync(folder)){
    fs.mkdirSync(folder);
  }

  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  const filename = `${timestamp}_${name}.js`;

  const filepath = path.join(folder, filename);
  fs.writeFileSync(filepath, template.trim());
  process.stdout.write(`Creating migration file: ${filename}\n`);
  process.exit(0);
};
