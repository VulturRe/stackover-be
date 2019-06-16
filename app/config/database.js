const mongoose = require('mongoose');
const db = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.NODE_ENV === 'prod' ? 'mongo' : 'localhost'}:27017/${process.env.MONGO_INITDB_DATABASE}?authMechanism=SCRAM-SHA-1&authSource=admin`;
mongoose.connect(db, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = mongoose;
