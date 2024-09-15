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
        "Payroll",
        "Loan Request",
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
      enum: ["open", "closed", "In Progress"],
      default: "open",
    },
    priority: {
      type: String,
      required: true,
      enum: ["3-Moderate", "2-High", "1-Critical"],
      default: "3-Moderate",
    },
    assignedTo: {
      type: String,
      required: true,
      enum: [
        "Not Assigned",
        "IT-Arvin Bautista",
        "IT-Joriz Cabrera",
        "IT-John Louie Gastardo",
        "HR-Cindy Tabudlong",
        "HR2",
        "HR3",
      ],
      default: "Not Assigned",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ticket", ticketSchema);
