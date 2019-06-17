const userService = require('../services/user.service');

module.exports = {
  create: async (req, res, next) => {
    try {
      const user = { email: req.body.email, login: req.body.login, password: req.body.password };
      const newUser = await userService.create(user).catch(err => next(err));
      res.status(200).json(newUser);
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
  }
}
