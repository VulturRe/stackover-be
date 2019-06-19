const express = require('express');
const router = express.Router();
const stackoverController = require('../api/controllers/stackoverflow.controller');

router.get('/similar', stackoverController.similar);

module.exports = router;
