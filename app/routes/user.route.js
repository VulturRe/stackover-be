const express = require('express');
const router = express.Router();
const userController = require('../api/controllers/user.controller');

router.post('/register', userController.create);
router.post('/auth', userController.authenticate);
router.post('/check-token', userController.checkRestoreToken);
router.post('/restore-begin', userController.restoreBegin);
router.post('/restore-end', userController.restoreEnd);

module.exports = router;
