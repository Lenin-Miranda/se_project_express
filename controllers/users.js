const User = require("../models/user");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    console.error(err);
    res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).orFail(() => {
      const error = new Error("User not found");
      error.statusCode = NOT_FOUND;
      throw error;
    });
    res.send(user);
  } catch (err) {
    console.error(err);
    if (err.name === "DocumentNotFoundError" || err.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).send({ message: "User not found" });
    }
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
    }
    res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const newUser = await User.create({ name, avatar });
    res.status(201).send(newUser);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid data" });
    }
    res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};
