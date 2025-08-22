const express = require("express");
const router = express.Router();
const {
    fetchPayrolls,
    fetchPayroll,
    createPayroll
} = require("../controllers/payrollController");
const { protect, verifyAdmin } = require("../middleware/authMiddleware");

// Get all payrolls
router.get("/", protect, verifyAdmin, fetchPayrolls);

// Get payroll by employeeId
router.get("/:id", protect, verifyAdmin, fetchPayroll);

// Create payroll
router.post("/", protect, verifyAdmin, createPayroll);

module.exports = router;
