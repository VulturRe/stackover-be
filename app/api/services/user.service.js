const Validator = require('fastest-validator');
const bcrypt = require('bcrypt');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const userDao = require('../dao/user.dao');

const userValidator = new Validator();
const RSA_PRIVATE_KEY = fs.readFileSync('./jwtRS256.key');

const userVSchema = {
  email: { type: 'email' },
  login: { type: 'string', min: 4 },
  password: { type: 'string', min: 6 }
};

class UserService {
  static async create(user) {
    const vres = userValidator.validate(user, userVSchema);
    if (vres && vres.length > 0) {
      const errors = {};
      for (const err of vres) {
        errors[err.field] = err.message;
      }

      throw {
        name: 'ValidationError',
        message: errors
      };
    }

    return new Promise((resolve, reject) => {
      userDao.create(user, async (err, result) => {
        if (err) {
          reject({ name: 'MongoError', message: err });
        } else {
          resolve({ id: result._id, email: result.email, login: result.login });
        }
      });
    })
  }

  static async authenticate(login, password) {
    return new Promise((resolve, reject) => {
      userDao.findOne({ login }, (err, user) => {
        console.log('err', err);
        console.log('user', user);
        if (err || !user) {
          reject({ name: 'MongoError', message: { errmsg: `Can not find user with login="${login}"` } });
        } else {
          if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({}, RSA_PRIVATE_KEY, {
              algorithm: 'RS256',
              expiresIn: '24h',
              subject: user._id.toString()
            });
            resolve({ idToken: token, expiresIn: 24*60*60 });
          } else {
            reject({ name: 'Invalid credentials', message: 'Wrong password' });
          }
        }
      })
    })
  }
}

module.exports = UserService;
