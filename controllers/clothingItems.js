const mongoose = require("mongoose");
const clothingItems = require("../models/clothingItem");

const { BadRequestError, NotFoundError } = require("../utils/errors");

const { ForbiddenError } = require("../utils/errors");

module.exports.getItem = async (req, res, next) => {
  try {
    const items = await clothingItems.find({});
    res.send(items);
  } catch (err) {
    next(err); // deja que el middleware lo maneje
  }
};

module.exports.createItem = async (req, res, next) => {
  try {
    const { name, weather, imageUrl } = req.body;

    if (!name || !weather || !imageUrl) {
      throw new BadRequestError("Missing required fields");
    }

    if (!["hot", "warm", "cold"].includes(weather)) {
      throw new BadRequestError("Invalid weather value");
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
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid item data"));
    }
    next(err);
  }
};

module.exports.deleteItem = async (req, res, next) => {
  try {
    const item = await clothingItems.findById(req.params.Id).orFail();

    if (item.owner.toString() !== req.user._id) {
      throw new ForbiddenError("You are not allowed to delete this item");
    }

    await item.deleteOne();

    res.send({
      message: "Item deleted successfully",
      deletedItem: item,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid item ID"));
    }
    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("Item not found"));
    }
    next(err);
  }
};

module.exports.likeItem = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.Id)) {
      throw new BadRequestError("Invalid item ID format");
    }

    const item = await clothingItems.findById(req.params.Id);
    if (!item) {
      throw new NotFoundError("Item not found");
    }

    const updatedItem = await clothingItems.findByIdAndUpdate(
      req.params.Id,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );

    res.send(updatedItem);
  } catch (err) {
    next(err);
  }
};

module.exports.dislikeItem = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.Id)) {
      throw new BadRequestError("Invalid item ID format");
    }

    const item = await clothingItems.findById(req.params.Id);
    if (!item) {
      throw new NotFoundError("Item not found");
    }

    const updatedItem = await clothingItems.findByIdAndUpdate(
      req.params.Id,
      { $pull: { likes: req.user._id } },
      { new: true }
    );

    res.send(updatedItem);
  } catch (err) {
    next(err);
  }
};
