function errorHandler(modelName, err, req, res, next) {
  switch (err.name) {
    case 'MongoError':
      handleMongoErrors(modelName, err.message, req, res, next);
      break;
    case 'ValidationError':
      res.status(400).json({ name: 'ValidationError', message: err.message });
    default:
      res.sendStatus(500);
      break;
  }
  next();
}

function handleMongoErrors(modelName, err, req, res, next) {
  switch(err.code) {
    case 11000: {
      const words = err.errmsg.split(' ');
      const index = words.findIndex(el => el === 'index:') + 1;
      const fieldName = words[index].split('_')[0];
      const value = words[words.length - 2];
      res.status(400).json({ name: 'DuplicateError', message: `${modelName} with ${fieldName}=${value} already exists!`});
      break;
    }
    default:
      res.status(400).json({ name: 'MongoError', message: err.errmsg });
      break;
  }
  next();
}

module.exports = errorHandler;
