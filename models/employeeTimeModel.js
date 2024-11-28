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
    timeIn: {
      type: Date,
    },
    timeOut: {
      type: Date,
      default: null,
    },
    totalTimeRendered: {
      type: Number, // Stores total time rendered in minutes
      default: 0,
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields automatically
  }
);

// Middleware to calculate `totalTimeRendered` before saving
employeeTimeSchema.pre("save", function (next) {
  if (this.timeOut !== null && this.timeIn) {
    const duration = (this.timeOut - this.timeIn) / 1000 / 60; // Convert ms to minutes
    this.totalTimeRendered = Math.max(duration, 0); // Ensure non-negative value
  }
  next();
});

module.exports = mongoose.model("EmployeeTime", employeeTimeSchema);
