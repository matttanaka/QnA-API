// set up connection to db here
const { Pool } = require('pg');

require('dotenv').config();

// const pool = new Pool({
//   user: 'mtanaka',
//   database: 'qna',
//   port: 5432,
// });

const pool = new Pool({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 5432,
  user: process.env.USER || 'mtanaka',
  password: process.end.PASSWORD || '',
  database: process.env.DATABASE || 'qna',
})

module.exports = {
  query: (text, params, callback) => pool.query(text, params, callback),
};
