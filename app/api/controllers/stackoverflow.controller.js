const stackoverService = require('../services/stackoverflow.service');

module.exports = {
  search: async (params, req, res, next) => {
    try {
      if (!params.intitle && !params.tagged) {
        throw {
          name: 'ValidationError',
          message: 'Intitle/tagged can not be empty'
        };
      }

      res.json(await stackoverService.search(params));
    } catch(err) {
      next(err);
    }
  },
  similar: async (params, req, res, next) => {
    try {
      if (!params.title) {
        throw {
          name: 'ValidationError',
          message: 'Title can not be empty'
        };
      }

      res.json(await stackoverService.searchSimilar(params));
    } catch(err) {
      next(err);
    }
  },
  answers: async (params, req, res, next) => {
    try {
      const { id } = req.params;

      if (!params.ids) {
        throw {
          name: 'ValidationError',
          message: 'Ids can not be empty'
        };
      }

      res.json(await stackoverService.answers(id, params));
    } catch (err) {
      next(err);
    }
    next();
  },
  userQuestions: async (params, req, res, next) => {
    try {
      const { id } = req.params;

      if (!params.ids) {
        throw {
          name: 'ValidationError',
          message: 'Ids can not be empty'
        };
      }

      req.json(await stackoverService.userQuestions(id, params));
    } catch (err) {
      next(err);
    }
  }
}
