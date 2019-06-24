const express = require('express');
const expressJwt = require('express-jwt');
const logger = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('./app/config/database');
const userRouter = require('./app/routes/user.route');
const stackRouter = require('./app/routes/stackoverflow.route');
const errorHandler = require('./app/api/middleware/errorHandler.middleware');
const restoreTokenService = require('./app/api/services/restoreToken.service');
const fs = require('fs');
const app = express();

const RSA_PUBLIC_KEY = fs.readFileSync('./jwtRS256.pub.key');

const checkIfAuthenticated = expressJwt({
  secret: RSA_PUBLIC_KEY,
  algorithms: ['RS256']
});

if (process.env.NODE_ENV === 'prod') {
  app.use(express.static('static'));
  app.use('/login', express.static('static'));
  app.use('/restore', express.static('static'));
  app.use('/reset', express.static('static'));
  app.use('/search', express.static('static'));
  app.use('/register', express.static('static'));
  app.use('/question/:questionId', express.static('static'));
}

app.use(logger('dev'));
app.use(bodyParser.json());
mongoose.connection.on('error', () => {
  console.error('MongoDB connection error');
  process.exit(1);
});

app.use('/api/user', userRouter, errorHandler);
app.use('/api/stack', checkIfAuthenticated, stackRouter, errorHandler);

app.listen(process.env.PORT, function () {
  console.log(`Node server listening on port ${process.env.PORT}`)
});

// Clean expired restore password tokens
setInterval(() => {
  console.log('RestoreToken clean start');
  restoreTokenService.clean().then(() => console.log('RestoreToken clean end'));
}, 5 * 60 * 1000);
