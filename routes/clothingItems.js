const express = require("express");

const router = express.Router();
const {
  getItem,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const { auth } = require("../middleware/auth");

router.get("/", getItem);
router.post("/", auth, createItem);

router.delete("/:Id", auth, deleteItem);
router.put("/:Id/likes", auth, likeItem);
router.delete("/:Id/likes", auth, dislikeItem);

module.exports = router;
