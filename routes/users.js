const express = require("express");

const router = express.Router();
const { getCurrentUser, updateUser } = require("../controllers/users");

//const { auth } = require("../middleware/auth");

router.get("/me", getCurrentUser);
router.patch("/me", updateUser);
module.exports = router;
