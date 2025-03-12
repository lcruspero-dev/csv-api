const express = require("express");
const router = express.Router();
const {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getUserProfileById,
} = require("../controllers/userProfileController");

const { protect, verifyAdmin } = require("../middleware/authMiddleware");

// Routes
router.post("/", protect, createUserProfile); // Create user profile
router.get("/", protect, getUserProfile); // Get user profile
router.put("/", protect, updateUserProfile); // Update user profile
router.delete("/", protect, verifyAdmin, deleteUserProfile); // Delete user profile
router.get("/:id", protect, verifyAdmin, getUserProfileById); // Get user profile by id

module.exports = router;
