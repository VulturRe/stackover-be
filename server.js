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
}

app.use(logger('dev'));
app.use(bodyParser.json());
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error'));

app.use('/api/stack', checkIfAuthenticated, stackRouter, errorHandler);
app.use('/api/user', userRouter, errorHandler);

app.listen(process.env.PORT, function () {
  console.log(`Node server listening on port ${process.env.PORT}`)
});

// Clean expired restore password tokens
setInterval(() => {
  console.log('RestoreToken clean start');
  restoreTokenService.clean().then(() => console.log('RestoreToken clean end'));
}, 5 * 60 * 1000);
