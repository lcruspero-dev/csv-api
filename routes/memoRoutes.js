const express = require("express");
const router = express.Router();
const {
  getMemos,
  createMemo,
  updateMemo,
  deleteMemo,
} = require("../controllers/memoController");

const { protect, verifyAdmin } = require("../middleware/authMiddleware");

router.get("/", protect, getMemos);

router.get("/:id", protect, getMemos);

router.post("/create", protect, verifyAdmin, createMemo);

router.put("/:id", protect, verifyAdmin, updateMemo);

router.delete("/:id", protect, verifyAdmin, deleteMemo);

module.exports = router;
