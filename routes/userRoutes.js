const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  adminResetPassword,
} = require("../controllers/userController");

const { protect, verifyAdmin } = require("../middleware/authMiddleware");

router.post("/", registerUser);

router.post("/login", loginUser);

router.post("/admin-reset-password", protect, verifyAdmin, adminResetPassword);

// Protected route (2nd argument) - protect
router.get("/me", protect, getMe);

module.exports = router;
