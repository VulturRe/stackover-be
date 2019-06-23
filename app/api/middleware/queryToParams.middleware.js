function queryToParams(req, res, next) {
  const params = {};
  Object.keys(req.query).forEach(key => {
    params[key] = req.query[key];
  });
  next(params);
}

module.exports = queryToParams;
