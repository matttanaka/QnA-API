// set up connection to db here
const { Client } = require('pg');

const client = new Client();
await client.connect();
