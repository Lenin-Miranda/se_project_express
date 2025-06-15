const express = require("express");

const router = express.Router();
const {
  getItem,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItem);
router.post("/", createItem);

router.delete("/:Id", deleteItem);
router.put("/:Id/likes", likeItem);
router.delete("/:Id/likes", dislikeItem);

module.exports = router;
