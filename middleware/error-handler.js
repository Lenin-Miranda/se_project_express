function errorHandler(err, req, res, next) {
  console.error("💥 Error atrapado en el middleware:", err);

  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "Internal Server Error" : message,
  });
}

module.exports = errorHandler;
