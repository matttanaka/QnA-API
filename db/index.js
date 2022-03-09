// set up connection to db here
const { Pool } = require('pg');

const pool = new Pool({
  user: 'mtanaka',
  database: 'qna',
  port: 5432,
});
// await pool.connect();

module.exports = {
  query: (text, params, callback) => pool.query(text, params, callback),
};
