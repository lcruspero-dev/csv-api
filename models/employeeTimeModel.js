const mongoose = require("mongoose");

const employeeTimeSchema = mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user", // Reference to the User model
    },
    employeeName: {
      type: String,
    },
    date: {
      type: String,
    },
    timeIn: {
      type: String,
    },
    timeOut: {
      type: String,
      default: null,
    },
    totalHours: {
      type: String,
      default: null,
    },
    breakStart: {
      type: String,
      default: null,
    },
    breakEnd: {
      type: String,
      default: null,
    },
    TotalBreakTime: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      default: null,
    },
    shift: {
      type: String,
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields automatically
  }
);

module.exports = mongoose.model("EmployeeTime", employeeTimeSchema);
