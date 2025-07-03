const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UnathorizedError } = require("../utils/UnathorizedError");

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnathorizedError("Authorization Required");
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnathorizedError("Authorization Required");
  }

  req.user = payload;
  next();
  return null;
};
