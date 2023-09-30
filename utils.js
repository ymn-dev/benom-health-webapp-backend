const errorHandler = (message, next, status = 500) => {
  const myError = new Error(message);
  myError.status = status;
  return next(myError);
};

module.exports = { errorHandler };
