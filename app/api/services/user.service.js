const Validator = require('fastest-validator');
const restoreTokenService = require('../services/restoreToken.service');
const mailer = require('../services/mailer.service');
const moment = require('moment');
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const userDao = require('../dao/user.dao');
const saltRounds = 10;

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
        } else {
          resolve(user);
        }
      })
    })
  }

  static async updatePassword(login, password) {
    return new Promise((resolve, reject) => {
      userDao.update({ login }, { password: bcrypt.hashSync(password, saltRounds) }, err => err ? reject({ name: 'MongoError', message: err }) : resolve());
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
        if (!user) throw { name: 'WrongParams', message: `Такого пользователя не существует` };
        if (!bcrypt.compareSync(password, user.password)) throw { name: 'WrongParams', message: 'Неверный пароль' };

        const token = jwt.sign({}, RSA_PRIVATE_KEY, {
          algorithm: 'RS256',
          expiresIn: '24h',
          subject: user._id.toString()
        });
        return { idToken: token, expiresIn: 24 * 60 * 60 };
      });
  }

  static async restoreBegin(login) {
    return UserService.findByLogin(login)
      .then(async user => {
        if (!user) throw { name: 'WrongParams', message: `Can not find user with login="${login}"` };
        let foundToken = await restoreTokenService.findByUserId(user.id);
        if (foundToken) {
          if (moment(foundToken.expiresAt).isBefore(moment())) {
            await restoreTokenService.deleteByToken(foundToken.token).then(() => {
              return {
                userId: user.id,
                token: uuid(),
                expiresAt: moment().add(1, 'h').valueOf()
              };
            }).then(token => restoreTokenService.create(token));
          }
        } else {
          foundToken = {
            userId: user.id,
            token: uuid(),
            expiresAt: moment().add(1, 'h').valueOf()
          };
          await restoreTokenService.create(foundToken);
        }

        let url = process.env.NODE_ENV === 'dev' ? 'http://localhost:4200/' : 'http://localhost:3000/';
        url += `reset?token=${foundToken.token}`;
        let emailTemplate = fs.readFileSync('./emailTemplates/restore.html', 'utf8');
        emailTemplate = emailTemplate.replace('{href}', url);
        emailTemplate = emailTemplate.replace('{login}', user.login);
        mailer.sendHtml(user.email, 'Восстановление пароля', emailTemplate);
      });
  }

  static async restoreEnd(token, password) {
    return restoreTokenService.findByTokenAndVerify(token)
      .then(token => UserService.findById(token.userId))
      .then(user => UserService.updatePassword(user.login, password))
      .then(restoreTokenService.deleteByToken(token));
  }
}

module.exports = UserService;
