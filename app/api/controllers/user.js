const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const RSA_PRIVATE_KEY = fs.readFileSync('./jwtRS256.key');

module.exports = {
  create: function (req, res) {
    console.log(req.body);
    userModel.create({ email: req.body.email, login: req.body.email, password: req.body.password },
      function (err, result) {
        if (err) res.status(400).json(err);
        res.status(200).send(result);
      });
  },
  authenticate: function (req, res) {
    userModel.findOne({ login: req.body.login }, function (err, user) {
      if (err) res.code(400).send('Can not find user');
      if (bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign({}, RSA_PRIVATE_KEY, {
          algorithm: 'RS256',
          expiresIn: '24h',
          subject: user._id.toString()
        });
        res.status(200).json({
          token,
          expiresIn: moment().add(24, 'h').valueOf()
        });
      } else {
        res.status(400).send('Wrong password');
      }
    })
  }
}
