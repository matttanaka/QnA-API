// server
const express = require('express');
const morgan = require('morgan');
const router = require('./router');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/', router);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
