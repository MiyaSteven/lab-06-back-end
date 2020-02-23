'use strict';

require('dotenv').config();
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);

client.on('error', err => {
  console.error('something bad has happened!', err.stack);
});

module.exports = client;
