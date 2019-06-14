const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extend: false }));

app.get('/', function (req, res) {
  res.json({ stackover: 'test', env: process.env.NODE_ENV });
});

app.listen(3000, function () {
  console.log('Node server listening on port 3000')
});
