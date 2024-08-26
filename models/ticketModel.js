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
      enum: [
        "General IT Support",
        "Hardware Issue",
        "Software Issue",
        "Network & Connectivity",
        "Account & Access Management",
        "Email & Communication",
        "Project & Change Management",
        "Request for Documents",
        "Request for Meeting",
        "Certificate of Employment",
        "Onboarding Request",
        "Employee Benefits",
        "Leave Request",
        "Other",
      ],
    },
    description: {
      type: String,
      required: [true, "Please enter a decription of the issue"],
    },
    status: {
      type: String,
      required: true,
      enum: ["new", "open", "close"],
      default: "new",
    },
    assignedTo: {
      type: String,
      required: true,
      enum: ["Empty", "IT1", "IT2", "IT3", "IT4"],
      default: "Empty",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ticket", ticketSchema);
