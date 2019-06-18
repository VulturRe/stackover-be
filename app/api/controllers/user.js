const userService = require('../services/user.service');
const restoreTokenService = require('../services/restoreToken.service');

module.exports = {
  create: async (req, res, next) => {
    try {
      const user = { email: req.body.email, login: req.body.login, password: req.body.password };
      await userService.create(user).catch(err => next(err));
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  },
  authenticate: async (req, res, next) => {
    try {
      const token = await userService.authenticate(req.body.login, req.body.password);
      res.status(200).json(token);
    } catch (err) {
      next(err);
    }
  },
  restoreBegin: async (req, res, next) => {
    try {
      await userService.restoreBegin(req.body.login);
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  },
  restoreEnd: async (req, res, next) => {
    try {
      await userService.restoreEnd(req.body.token, req.body.password);
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  },
  checkRestoreToken: async (req, res, next) => {
    try {
      const token = await restoreTokenService.findByToken(req.body.token);
      token ? res.status(200).send(true) : res.status(200).send(false);
    } catch (err) {
      next(err);
    }
  }
}
