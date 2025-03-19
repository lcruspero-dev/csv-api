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
  schedule: [
    {
      date: {
        type: String, // You can also use Date type if needed
      },
      shiftType: {
        type: String,
      },
      startTime: {
        type: String,
      },
      endTime: {
        type: String,
      },
    },
  ],
  teamLeader: {
    type: String,
  },
  position: {
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

const teamLeaderEntrySchema = new mongoose.Schema({
  teamLeader: {
    type: String,
  },
});

const ScheduleEntry = mongoose.model("ScheduleEntry", scheduleEntrySchema);
const AttendanceEntry = mongoose.model(
  "AttendanceEntry",
  attendanceEntrySchema
);
const TeamLeaderEntry = mongoose.model(
  "TeamLeaderEntry",
  teamLeaderEntrySchema
);

module.exports = { ScheduleEntry, AttendanceEntry, TeamLeaderEntry };
