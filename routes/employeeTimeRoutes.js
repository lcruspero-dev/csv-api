const express = require("express");
const router = express.Router();
const {
  getEmployeeTimes,
  createEmployeeTimeIn,
  createEmployeeTimeOut,
  updateEmployeeTime,
  deleteEmployeeTime,
  updateEmployeeTimeOut,
  getEmployeeTimeWithNullTimeOut,
  getEmployeeTimeByEmployeeId,
} = require("../controllers/employeeTimeController");
const { protect, verifyAdmin } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(protect, getEmployeeTimes)
  .post(protect, createEmployeeTimeIn)
  .put(protect, updateEmployeeTimeOut);

router.route("/times").get(protect, getEmployeeTimes);

router.route("/null").get(protect, getEmployeeTimeWithNullTimeOut);

router.route("/time").get(protect, getEmployeeTimeByEmployeeId);

router
  .route("/:id")
  .put(protect, createEmployeeTimeOut)
  .patch(protect, verifyAdmin, updateEmployeeTime)
  .delete(protect, verifyAdmin, deleteEmployeeTime);

module.exports = router;
