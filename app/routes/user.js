const express = require('express');
const expressJwt = require('express-jwt');
const router = express.Router();
const userController = require('../api/controllers/user');
const fs = require('fs');

const RSA_PUBLIC_KEY = fs.readFileSync('./jwtRS256.pub.key');

const checkIfAuthenticated = expressJwt({
  secret: RSA_PUBLIC_KEY,
  algorithms: ['RS256']
});

router.post('/register', userController.create);
router.post('/auth', userController.authenticate);
router.post('/restore-begin', checkIfAuthenticated, userController.restoreBegin);

module.exports = router;
