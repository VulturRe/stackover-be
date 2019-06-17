const userService = require('../services/user.service');
const restoreTokenService = require('../services/restoreToken.service');
const mailer = require('../services/mailer.service');
const moment = require('moment');
const uuid = require('uuid/v4');

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
      const user = await userService.findByLogin(req.body.login);
      const foundToken = await restoreTokenService.findByUserId(user.id);
      if (foundToken) {
        await mailer.send(user.email, 'Восстановление пароля', foundToken.token);
      } else {
        const token = {
          userId: user.id,
          token: uuid(),
          expiresAt: moment().add(1, 'h').valueOf()
        };
        await restoreTokenService.create(token);
        await mailer.send(user.email, 'Восстановление пароля', token.token);
      }
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
}
