const mongoose = require("mongoose");

const ticketSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      ref: "User",
    },
    category: {
      type: String,
      required: [true, "Please select a Category"],
    },
    description: {
      type: String,
      required: [true, "Please enter a decription of the issue"],
    },
    status: {
      type: String,
      required: true,
      enum: ["open", "closed", "In Progress"],
      default: "open",
    },
    priority: {
      type: String,
      required: true,
      enum: ["4-Low", "3-Moderate", "2-High", "1-Critical"],
      default: "4-Low",
    },
    assignedTo: {
      type: String,
      required: true,
      default: "Not Assigned",
    },
    closingNote: {
      type: String,
      default: null,
    },

    file: {
      type: String,
    },
    department: {
      type: String,
      required: true,
      enum: ["HR", "IT"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ticket", ticketSchema);
