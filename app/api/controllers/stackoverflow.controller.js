const stackoverService = require('../services/stackoverflow.service');

module.exports = {
  similar: async (req, res, next) => {
    try {
      const params = {
        title: req.query.title,
        sort: req.query.sort,
        order: req.query.order,
        page: req.query.page,
        pagesize: req.query.pagesize
      };

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
    next();
  }
}
