const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  adminResetPassword,
  getAllUsersEmails,
  searchUsers,
  setUserToInactive,
  setUserToActive,
} = require("../controllers/userController");

const { protect, verifyAdmin } = require("../middleware/authMiddleware");

router.post("/", registerUser);

router.post("/login", loginUser);

router.post("/admin-reset-password", protect, verifyAdmin, adminResetPassword);

// Protected route (2nd argument) - protect
router.get("/me", protect, getMe);

router.get("/emails", protect, verifyAdmin, getAllUsersEmails);

router.get("/search", protect, verifyAdmin, searchUsers);

router.put("/inactive/:userId", protect, verifyAdmin, setUserToInactive);

router.put("/active/:userId", protect, verifyAdmin, setUserToActive);

module.exports = router;
