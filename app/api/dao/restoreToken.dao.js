const mongoose = require('mongoose');

const restoreTokenSchema = new mongoose.Schema({
  userId: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  token: {
    type: String,
    trim: true,
    required: true
  },
  expiresAt: {
    type: Date,
    trim: true,
    required: true
  }
});

module.exports = mongoose.model('RestoreToken', restoreTokenSchema);
