const mongoose = require("mongoose");

const userProfileSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    middleName: {
      type: String,
    },
    streetAddress: {
      type: String,
    },
    barangay: {
      type: String,
    },
    cityMunicipality: {
      type: String,
    },
    province: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    personalEmail: {
      type: String,
    },
    contactNumber: {
      type: String,
    },
    dateOfBirth: {
      type: String,
    },
    // age: {
    //   type: String,
    // },
    emergencyContactPerson: {
      type: String,
    },
    emergencyContactNumber: {
      type: String,
    },
    relationship: {
      type: String,
    },
    civilStatus: {
      type: String,
    },
    gender: {
      type: String,
    },
    pagibigNo: {
      type: String,
    },
    philhealthNo: {
      type: String,
    },
    sssNo: {
      type: String,
    },
    tinNo: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserProfile", userProfileSchema);
