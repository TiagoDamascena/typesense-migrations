import path from 'path';
import fs from 'fs';
import type { Arguments, CommandBuilder } from 'yargs';

type Options = {
  name: string;
};

const folder = 'migrations';

export const command: string = 'generate <name>';
export const desc: string = 'Generate a new migration file';

export const builder: CommandBuilder<Options, Options> = (yargs) => {
  return yargs
    .positional('name', { type: 'string', demandOption: true });
};

export const handler = (argv: Arguments<Options>): void => {
  const { name } = argv;

  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  const filename = `${timestamp}_${name}.js`;
  const filepath = path.join(folder, filename);

  const template = `
module.exports = {
  up: async (client) => {
    // Add migration code here
  },

  down: async (client) => {
    // Add rollback code here
  },
};
  `;

  if (!fs.existsSync(folder)){
    fs.mkdirSync(folder);
  }

  fs.writeFileSync(filepath, template.trim());
  process.stdout.write(`Creating migration file: ${filename}\n`);
  process.exit(0);
};
