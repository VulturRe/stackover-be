const Validator = require('fastest-validator');
const bcrypt = require('bcrypt');
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

  static async findById(userId) {
    return new Promise((resolve, reject) => {
      userDao.findById(userId, (err, user) => {
        if (err) {
          reject({ name: 'MongoError', message: err });
        } else if (!user) {
          resolve(null);
        } else {
          resolve(user);
        }
      })
    })
  }

  static async findByLogin(login) {
    return new Promise((resolve, reject) => {
      userDao.findOne({ login }, (err, user) => {
        if (err) {
          return reject({ name: 'MongoError', message: err });
        } else if (!user) {
          return resolve(null);
        } else {
          return resolve(user);
        }
      })
    })
  }

  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      userDao.findOne({ email }, (err, user) => {
        if (err) {
          reject({ name: 'MongoError', message: err });
        } else if (!user) {
          resolve(null);
        } else {
          resolve(user);
        }
      })
    })
  }

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

    return UserService.findByLogin(user.login)
      .then(usr => {
        if (usr) throw { name: 'WrongParams', message: `User with login="${user.login}" already exists` };
      })
      .then(() => UserService.findByEmail(user.email))
      .then(usr => {
        if (usr) throw { name: 'WrongParams', message: `User with email="${user.email}" already exists` };
      })
      .then(() => {
        userDao.create(user, async (err, result) => {
          if (err) {
            throw { name: 'MongoError', message: err };
          } else {
            return { id: result._id, email: result.email, login: result.login };
          }
        });
      })
  }

  static async authenticate(login, password) {
    return UserService.findByLogin(login)
      .then(user => {
        if (!user) throw { name: 'WrongParams', message: `Can not find user with login="${login}"` };
        if (!bcrypt.compareSync(password, user.password)) throw { name: 'WrongParams', message: 'Invalid password' };

        const token = jwt.sign({}, RSA_PRIVATE_KEY, {
          algorithm: 'RS256',
          expiresIn: '24h',
          subject: user._id.toString()
        });
        return { idToken: token, expiresIn: 24 * 60 * 60 };
      });
  }
}

module.exports = UserService;
