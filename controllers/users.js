const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { BadRequestError } = require("../utils/errors");
const { NotFoundError } = require("../utils/NotFoundError");
const { ConflictError } = require("../utils/ConflictError");
const { UnathorizedError } = require("../utils/UnathorizedError");

const { JWT_SECRET } = require("../utils/config");

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).orFail();
    res.send(user);
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      next(new NotFoundError("User not found"));
    } else if (err.name === "CastError") {
      next(new BadRequestError("Invalid user ID"));
    } else {
      next(err);
    }
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;

    if (!name || !avatar || !email || !password) {
      throw new BadRequestError("Missing required fields");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError("User already exists");
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
    if (err.name === "ValidationError") {
      next(new BadRequestError("Invalid data"));
    } else if (err.code === 11000) {
      next(new ConflictError("User already exists"));
    } else {
      next(err);
    }
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new UnathorizedError("Incorrect email or password");
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new UnathorizedError("Incorrect email or password");
    }
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(200).send({
      token,
      email: user.email,
      name: user.name,
    });
    return null;
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data"));
    } else {
      return next(err);
    }
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;

    if (!name && !avatar) {
      throw new BadRequestError("No fields to update");
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).send({
      name: user.name,
      avatar: user.avatar,
      token,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new BadRequestError("Invalid data"));
    } else {
      next(err);
    }
  }
};
