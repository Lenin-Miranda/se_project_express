const express = require("express");

const router = express.Router();
const { getCurrentUser, updateUser } = require("../controllers/users");

const { auth } = require("../middleware/auth");
const { validateUpdateUser } = require("../middleware/validation");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateUpdateUser, updateUser);
module.exports = router;
