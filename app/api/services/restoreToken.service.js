const Validator = require('fastest-validator');
const restoreTokenDao = require('../dao/restoreToken.dao');
const moment = require('moment');
const tokenValidator = new Validator();

const tokenVSchema = {
  userId: { type: 'string' },
  token: { type: 'string' },
  expiresAt: { type: 'number' }
};

class RestoreTokenService {

  static async create(token) {
    const vres = tokenValidator.validate(token, tokenVSchema);
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
      restoreTokenDao.create(token, (err, res) => {
        if (err) {
          reject({ name: 'MongoError', message: err });
        } else {
          resolve(res);
        }
      });
    });
  }

  static async findByUserId(userId) {
    return new Promise((resolve, reject) => {
      restoreTokenDao.findOne({ userId }, (err, res) => {
        if (err) {
          reject({ name: 'MongoError', message: err });
        } else {
          resolve(res);
        }
      });
    });
  }

  static async findByToken(token) {
    return new Promise((resolve, reject) => {
      restoreTokenDao.findOne({ token }, (err, res) => {
        if (err) {
          reject({ name: 'MongoError', message: err });
        } else {
          resolve(res);
        }
      });
    });
  }

  static async findByTokenAndVerify(token) {
    return RestoreTokenService.findByToken(token)
      .then(token => {
        if (!token) return false;
        const now = moment();
        const expiresAt = moment(token.expiresAt);
        if (expiresAt.isSameOrBefore(now)) {
          return false;
        }
        return token;
      })
  }
  
  static async deleteByToken(token) {
    return new Promise((resolve, reject) => {
      restoreTokenDao.deleteOne({ token }, err => {
        if (err) {
          reject({ name: 'MongoError', message: err });
        } else {
          resolve();
        }
      });
    });
  }

  static async clean() {
    return new Promise((resolve, reject) => {
      restoreTokenDao.deleteMany({ expiresAt: { $lt: moment() } }, err => {
        if (err) {
          reject({ name: 'MongoError', message: err });
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = RestoreTokenService;
