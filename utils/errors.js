module.exports = {
  BAD_REQUEST: 400,
  FORBIDDEN_ERROR: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  UNAUTHORIZED_ERROR: 401,
  CONFLICT_ERROR: 409,
};

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class UnathorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}

module.exports = {
  BadRequestError,
  UnathorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ServerError,
};
