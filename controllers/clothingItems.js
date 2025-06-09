const mongoose = require("mongoose");
const clothingItems = require("../models/clothingItem");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

module.exports.getItem = async (req, res) => {
  try {
    const items = await clothingItems.find({});
    res.send(items);
  } catch (err) {
    console.error(err);
    res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

module.exports.createItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user._id;
    const newItem = await clothingItems.create({
      name,
      weather,
      imageUrl,
      owner,
    });
    res.status(201).send(newItem);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid item data" });
    }
    res
      .status(SERVER_ERROR)
      .send({ message: "An error occurred on the server" });
  }
  return null;
};

module.exports.deleteItem = async (req, res) => {
  try {
    const item = await clothingItems
      .findByIdAndDelete(req.params.itemId)
      .orFail(() => {
        throw new mongoose.Error.DocumentNotFoundError(null);
      });

    return res.send({
      message: "Item deleted successfully",
      deletedItem: item, // o solo item._id
    });
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
    }
    if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND).send({ message: "Item not found" });
    }
    return res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

module.exports.likeItem = async (req, res) => {
  try {
    const updatedItem = await clothingItems
      .findByIdAndUpdate(
        req.params.itemId,
        { $addToSet: { likes: req.user._id } },
        { new: true }
      )
      .orFail(() => {
        throw new mongoose.Error.DocumentNotFoundError(null);
      });

    res.send(updatedItem);
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
    }
    if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND).send({ message: "Item not found" });
    }
    res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
  return null;
};

module.exports.dislikeItem = async (req, res) => {
  try {
    const updatedItem = await clothingItems
      .findByIdAndUpdate(
        req.params.itemId,
        { $pull: { likes: req.user._id } },
        { new: true }
      )
      .orFail(() => {
        throw new mongoose.Error.DocumentNotFoundError(null);
      });

    res.send(updatedItem);
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
    }
    if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND).send({ message: "Item not found" });
    }
    res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
  return null;
};
