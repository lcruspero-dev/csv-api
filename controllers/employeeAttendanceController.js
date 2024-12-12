const asyncHandler = require("express-async-handler");
const EmployeeAttendance = require("../models/employeeAttendanceModel");

const getEmployeeAttendance = asyncHandler(async (_req, res) => {
  try {
    const employeeAttendance = await EmployeeAttendance.find().sort({
      createdAt: -1,
    });
    res.status(200).json(employeeAttendance);
  } catch (error) {
    console.log(error);
    res.status(404);
    throw new Error("Employee Attendance not found");
  }
});

const createAttendanceDate = asyncHandler(async (req, res) => {
  const { date, day } = req.body;
  if (!date || !day) {
    res.status(400);
    throw new Error("Please set day and date");
  }

  const employeeAttendance = await EmployeeAttendance.create(req.body);
  res.status(200).json(employeeAttendance);
});

const updateEmployeeAttendance = asyncHandler(async (req, res) => {
  // Find attendance record by date
  const employeeAttendance = await EmployeeAttendance.findOne({
    date: req.body.date,
  });

  if (!employeeAttendance) {
    res.status(404);
    throw new Error("Employee Attendance not found for the specified date");
  }

  // Update day if provided
  if (req.body.day) {
    employeeAttendance.day = req.body.day;
  }

  // Add or update names
  if (req.body.names) {
    // Ensure all required fields are present
    if (req.body.names.employeeId && req.body.names.employeeName) {
      // Check if names array exists, if not initialize it
      if (!employeeAttendance.names) {
        employeeAttendance.names = [];
      }

      // Find if an entry with the same employeeId already exists
      const existingEmployeeIndex = employeeAttendance.names.findIndex(
        (name) =>
          name.employeeId.toString() === req.body.names.employeeId.toString()
      );

      if (existingEmployeeIndex !== -1) {
        // Update existing entry
        employeeAttendance.names[existingEmployeeIndex] = {
          employeeId: req.body.names.employeeId,
          employeeName: req.body.names.employeeName,
          status:
            req.body.names.status ||
            employeeAttendance.names[existingEmployeeIndex].status,
          tl:
            req.body.names.tl ||
            employeeAttendance.names[existingEmployeeIndex].tl,
        };
      } else {
        // Add new names entry
        employeeAttendance.names.push({
          employeeId: req.body.names.employeeId,
          employeeName: req.body.names.employeeName,
          status: req.body.names.status || "",
          tl: req.body.names.tl || "",
        });
      }
    } else {
      return res.status(400).json({
        message:
          "EmployeeId and EmployeeName are required to add or update names",
      });
    }
  }

  const updatedEmployeeAttendance = await employeeAttendance.save();
  res.status(200).json(updatedEmployeeAttendance);
});
module.exports = {
  getEmployeeAttendance,
  createAttendanceDate,
  updateEmployeeAttendance,
};
