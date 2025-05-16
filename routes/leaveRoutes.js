// routes/leaveRoutes.js
const express = require("express");
const { zonedTimeToUtc, utcToZonedTime, format } = require("date-fns-tz");
const { addMonths, lastDayOfMonth } = require("date-fns");
const EmployeeLeave = require("../models/EmployeeLeave");

const PH_TIMEZONE = "Asia/Manila";
const router = express.Router();

// Helper to format dates for display (now in MM/DD/YYYY format)
const formatForDisplay = (date) => {
  return format(utcToZonedTime(date, PH_TIMEZONE), "MM/dd/yyyy", {
    timeZone: PH_TIMEZONE,
  });
};

// Helper to get the same day next month (adjusts for short months)
const getSameDayNextMonth = (date) => {
  const originalDay = date.getDate();
  let nextMonth = addMonths(date, 1);

  // If the next month doesn't have this day (e.g., Jan 31 → Feb 28/29)
  if (nextMonth.getDate() !== originalDay) {
    nextMonth = lastDayOfMonth(nextMonth); // Adjust to last day
  }

  return nextMonth;
};

// Get all employee leave records with PHT dates (now in MM/DD/YYYY format)
router.get("/", async (req, res) => {
  try {
    const employees = await EmployeeLeave.find();
    const formattedEmployees = employees.map((emp) => ({
      ...emp.toObject(),
      startDate: formatForDisplay(emp.startDate),
      lastAccrualDate: formatForDisplay(emp.lastAccrualDate),
      nextAccrualDate: formatForDisplay(emp.nextAccrualDate),
    }));
    res.json(formattedEmployees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new employee leave record with PHT dates (now in MM/DD/YYYY format)
router.post("/", async (req, res) => {
  try {
    const { employeeId, employeeName } = req.body;

    // Set defaults
    const annualLeaveCredit = 18; // Default annual leave credit
    const startDate = new Date(); // Current date as default start date

    // Convert start date (in PHT) to UTC
    const startDateUTC = zonedTimeToUtc(startDate, PH_TIMEZONE);
    const accrualRate = annualLeaveCredit / 12;

    // Calculate next accrual date (same day next month)
    const nextAccrualPHT = getSameDayNextMonth(startDate);
    const nextAccrualUTC = zonedTimeToUtc(nextAccrualPHT, PH_TIMEZONE);

    const employeeLeave = new EmployeeLeave({
      employeeId,
      employeeName,
      annualLeaveCredit,
      currentBalance: 0,
      startDate: startDateUTC,
      accrualRate,
      lastAccrualDate: startDateUTC,
      nextAccrualDate: nextAccrualUTC,
      // cycleDays: 0, // Now using monthly cycle (same day)
      timezone: PH_TIMEZONE,
      history: [
        {
          date: new Date(),
          action: "initial setup",
          amount: 0,
          description: "Leave account created",
        },
      ],
    });

    await employeeLeave.save();
    res.status(201).json({
      ...employeeLeave.toObject(),
      startDate: formatForDisplay(employeeLeave.startDate), // Now in MM/DD/YYYY
      lastAccrualDate: formatForDisplay(employeeLeave.lastAccrualDate), // Now in MM/DD/YYYY
      nextAccrualDate: formatForDisplay(employeeLeave.nextAccrualDate), // Now in MM/DD/YYYY
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
