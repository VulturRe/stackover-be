const Validator = require('fastest-validator');
const restoreTokenDao = require('../dao/restoreToken.dao');
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
      restoreTokenDao.create(token, async (err, res) => {
        if (err) {
          reject({ name: 'MongoError', message: err });
        } else {
          resolve(res);
        }
      })
    })
  }

  static async findByUserId(userId) {
    return new Promise((resolve, reject) => {
      restoreTokenDao.findOne({ userId }, async (err, res) => {
        if (err) {
          reject({ name: 'MongoError', message: err });
        } else {
          resolve(res);
        }
      })
    });
  }
}

module.exports = RestoreTokenService;
