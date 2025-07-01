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
const { validateCardBody, validateId } = require("../middleware/validation");

router.get("/", getItem);
router.post("/", auth, validateCardBody, createItem);

router.delete("/:Id", auth, validateId, deleteItem);
router.put("/:Id/likes", auth, validateId, likeItem);
router.delete("/:Id/likes", auth, validateId, dislikeItem);

module.exports = router;
