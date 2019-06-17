function errorHandler(modelName, err, req, res, next) {
  switch (err.name) {
    case 'WrongParams': 
      res.status(400).send(err.message);
      break;
    case 'MongoError':
      handleMongoErrors(modelName, err.message, req, res, next);
      break;
    case 'ValidationError':
      res.status(400).json({ name: 'ValidationError', message: err.message });
      break;
    default:
      res.status(500).json(err);
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
      res.status(500).json({ name: 'MongoError', message: err.errmsg });
      break;
  }
  next();
}

module.exports = errorHandler;
