const mongoose = require("mongoose");
const clothingItems = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  FORBIDDEN_ERROR,
} = require("../utils/errors");
const clothingItem = require("../models/clothingItem");

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

    // Validar que todos los campos requeridos estén presentes
    if (!name || !weather || !imageUrl) {
      return res
        .status(BAD_REQUEST)
        .send({ message: "Missing required fields" });
    }

    // Validar que weather sea uno de los valores permitidos
    if (!["hot", "warm", "cold"].includes(weather)) {
      return res.status(BAD_REQUEST).send({ message: "Invalid weather value" });
    }

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
      .findByIdAndDelete(req.params.Id)
      .orFail(() => {
        throw new mongoose.Error.DocumentNotFoundError(null);
      });
    if (item.owner.toString() !== req.user._id) {
      return res
        .status(FORBIDDEN_ERROR)
        .send({ message: "You are not allowed to delete this item" });
    }

    await item.deleteOne();

    return res.send({
      message: "Item deleted successfully",
      deletedItem: item,
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
    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(req.params.Id)) {
      return res
        .status(BAD_REQUEST)
        .send({ message: "Invalid item ID format" });
    }

    // Verificar si el documento existe
    const item = await clothingItems.findById(req.params.Id);
    if (!item) {
      return res.status(NOT_FOUND).send({ message: "Item not found" });
    }

    const updatedItem = await clothingItems.findByIdAndUpdate(
      req.params.Id,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );

    res.send(updatedItem);
  } catch (err) {
    console.error(err);
    res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
  return null;
};

module.exports.dislikeItem = async (req, res) => {
  try {
    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(req.params.Id)) {
      return res
        .status(BAD_REQUEST)
        .send({ message: "Invalid item ID format" });
    }

    // Verificar si el documento existe
    const item = await clothingItems.findById(req.params.Id);
    if (!item) {
      return res.status(NOT_FOUND).send({ message: "Item not found" });
    }

    const updatedItem = await clothingItems.findByIdAndUpdate(
      req.params.Id,
      { $pull: { likes: req.user._id } },
      { new: true }
    );

    res.send(updatedItem);
  } catch (err) {
    console.error(err);
    res
      .status(SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
  return null;
};
