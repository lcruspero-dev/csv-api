const mongoose = require("mongoose");

const scheduleEntrySchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    // ref: "user", // Reference to the User model
  },
  employeeName: {
    type: String,
  },
  date: {
    type: String,
  },
  shiftType: {
    type: String,
    enum: ["morning", "afternoon", "night", "off"],
  },
  department: {
    type: String,
  },
});

const attendanceEntrySchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    // ref: "user", // Reference to the User model
  },
  date: {
    type: String,
  },
  status: {
    type: String,
    enum: ["present", "absent", "late", "holiday", "pending"],
    required: true,
  },
  checkinTime: {
    type: String,
  },
  checkoutTime: {
    type: String,
  },
});

const ScheduleEntry = mongoose.model("ScheduleEntry", scheduleEntrySchema);
const AttendanceEntry = mongoose.model(
  "AttendanceEntry",
  attendanceEntrySchema
);

module.exports = { ScheduleEntry, AttendanceEntry };
