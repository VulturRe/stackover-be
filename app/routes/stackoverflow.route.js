const express = require('express');
const router = express.Router();
const queryToParams = require('../api/middleware/queryToParams.middleware');
const stackoverController = require('../api/controllers/stackoverflow.controller');

router.get('/search', queryToParams, stackoverController.search);
router.get('/similar', queryToParams, stackoverController.similar);
router.get('/users/:id/questions', queryToParams, stackoverController.userQuestions);
router.get('/questions/:id', stackoverController.question);
router.get('/questions/:id/answers', queryToParams, stackoverController.answers)

module.exports = router;
