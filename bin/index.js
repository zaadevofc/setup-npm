#!/usr/bin/env node

const main = require('../dist/index.js');

main(process.argv.slice(2)).catch((error) => {
  console.error('An error occurred:', error);
  process.exit(1);
});
