const express = require("express");
const router = express.Router();
const {
  getEmployeeAttendance,
  createAttendanceDate,
  updateEmployeeAttendance,
} = require("../controllers/employeeAttendanceController");
const { protect, verifyAdmin } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(protect, getEmployeeAttendance)
  .post(protect, verifyAdmin, createAttendanceDate);
router.route("/update").put(protect, updateEmployeeAttendance);

module.exports = router;
