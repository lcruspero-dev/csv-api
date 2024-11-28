const express = require("express");
const router = express.Router();
const {
  getEmployeeTimes,
  createEmployeeTimeIn,
  createEmployeeTimeOut,
  updateEmployeeTime,
  deleteEmployeeTime,
} = require("../controllers/employeeTimeController");
const { protect, verifyAdmin } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(protect, getEmployeeTimes)
  .post(protect, createEmployeeTimeIn);

router
  .route("/:id")
  .put(protect, createEmployeeTimeOut)
  .patch(protect, verifyAdmin, updateEmployeeTime)
  .delete(protect, verifyAdmin, deleteEmployeeTime);

module.exports = router;
