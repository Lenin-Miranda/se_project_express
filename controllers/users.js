const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  CONFLICT_ERROR,
  UNAUTHORIZED_ERROR,
} = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

module.exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).orFail(() => {
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
  return null;
};

module.exports.createUser = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!name || !avatar || !email || !password) {
      return res
        .status(BAD_REQUEST)
        .send({ message: "Missing required fields" });
    }

    // Primero verificamos si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(CONFLICT_ERROR)
        .send({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    const userToSend = newUser.toObject();
    delete userToSend.password;

    res.status(201).send(userToSend);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid data" });
    }
    if (err.code === 11000) {
      return res.status(BAD_REQUEST).send({ message: "User already exists" });
    }
    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
  return null;
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validar que ambos campos estén presentes
  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(UNAUTHORIZED_ERROR)
        .send({ message: "Incorrect email or password" });
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res
        .status(UNAUTHORIZED_ERROR)
        .send({ message: "Incorrect email or password" });
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    // Enviar el token y los datos del usuario en el formato esperado
    res.status(200).send({
      token,
      email: user.email,
      name: user.name,
    });
  } catch (err) {
    console.error("Error en login:", err);
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid data" });
    }
    res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
  return null;
};

module.exports.updateUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    // Verificar que al menos uno de los campos esté presente
    if (!name && !avatar) {
      return res.status(BAD_REQUEST).send({ message: "No fields to update" });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(NOT_FOUND).send({ message: "User not found" });
    }

    // Generar nuevo token
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).send({
      name: user.name,
      avatar: user.avatar,
      token,
    });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid data" });
    }
    res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
  return null;
};
