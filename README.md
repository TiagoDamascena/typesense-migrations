# Typesense Migrations

A simple migration manager for Typesense. Apply changes to your collections
during deploy and easily revert them if needed.

## Installation
Install it on your project using npm
```bash
npm install --save-dev typesense-migrations
```
## Configuration
Add a config file to the root of your project named `typesense-migrations.js`
and use it to configure a custom migrations folder and collection name if
needed and also the configurations of the Typesense client.
```javascript
module.exports = {
  folder: 'migrations',
  collection: '_migrations',
  client: {
    nodes: [
      {
        host: 'localhost',
        port: 8108,
        protocol: 'http',
      },
    ],
    apiKey: 'secret',
  },
};
```

## Usage
```bash
npx typesense-migrations generate <name>        Generates a new migration file
npx typesense-migrations migrate                Run all pending migrations
npx typesense-migrations rollback               Reverst the last batch of migrations
```
