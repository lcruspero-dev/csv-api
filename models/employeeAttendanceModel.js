const mongoose = require("mongoose");

const employeeAttendanceSchema = mongoose.Schema(
  {
    date: {
      type: String,
      unique: true,
    },
    day: {
      type: String,
    },
    names: [
      {
        employeeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user", // Reference to the User model
        },
        employeeName: {
          type: String,
        },
        status: {
          type: String,
        },
        tl: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields automatically
  }
);

module.exports = mongoose.model("EmployeeAttendance", employeeAttendanceSchema);
