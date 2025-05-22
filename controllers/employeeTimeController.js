const e = require("express");
const EmployeeTime = require("../models/employeeTimeModel");
const mongoose = require("mongoose");

const getEmployeeTimes = async (_req, res) => {
  try {
    const employeeTimes = await EmployeeTime.find();
    res.status(200).json(employeeTimes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const createEmployeeTimeIn = async (req, res) => {
  try {
    // Check for existing record
    const existingRecord = await EmployeeTime.findOne({
      employeeId: req.user._id,
      date: req.body.date,
      shift: req.body.shift,
    });

    if (existingRecord) {
      return res.status(409).json({
        message: "Duplicate entry: Time-in already recorded for this date.",
      });
    }

    // Create new record if no duplicate is found
    const newEmployeeTime = await EmployeeTime.create({
      employeeId: req.user._id,
      employeeName: req.user.name,
      date: req.body.date,
      timeIn: req.body.timeIn,
      shift: req.body.shift,
    });

    return res.status(201).json(newEmployeeTime);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const createEmployeeTimeOut = async (req, res) => {
  try {
    const employeeTime = await EmployeeTime.findById(req.params.id);
    if (!employeeTime) {
      return res.status(404).json({ message: "Employee time not found" });
    }
    employeeTime.timeOut = req.body.timeOut;
    await employeeTime.save();
    res.status(200).json(employeeTime);
  } catch (error) {
    console.error("Error saving employee time:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const updateEmployeeTime = async (req, res) => {
  try {
    const {
      secretKey,
      date,
      timeIn,
      timeOut,
      totalHours,
      notes,
      shift,
      breakStart,
      breakEnd,
      totalBreakTime,
      dateBreakStart,
      dateBreakEnd,
      lunchStart,
      lunchEnd,
      totalLunchTime,
      dateLunchStart,
      dateLunchEnd,
      secondBreakStart,
      secondBreakEnd,
      totalSecondBreakTime,
    } = req.body;

    // Validate secret key from environment variable
    if (secretKey !== process.env.UPDATE_SECRET_KEY) {
      return res.status(400).json({ message: "Invalid secret key" });
    }

    const employeeTime = await EmployeeTime.findById(req.params.id);
    if (!employeeTime) {
      return res.status(404).json({ message: "Employee time not found" });
    }

    // Update employee time fields
    employeeTime.date = date;
    employeeTime.timeIn = timeIn;
    employeeTime.timeOut = timeOut;
    employeeTime.totalHours = totalHours;
    employeeTime.notes = notes;
    employeeTime.shift = shift;
    employeeTime.breakStart = breakStart;
    employeeTime.breakEnd = breakEnd;
    employeeTime.totalBreakTime = totalBreakTime;
    employeeTime.dateBreakStart = dateBreakStart;
    employeeTime.dateBreakEnd = dateBreakEnd;
    employeeTime.lunchStart = lunchStart;
    employeeTime.lunchEnd = lunchEnd;
    employeeTime.totalLunchTime = totalLunchTime;
    employeeTime.dateLunchStart = dateLunchStart;
    employeeTime.dateLunchEnd = dateLunchEnd;
    employeeTime.secondBreakStart = secondBreakStart;
    employeeTime.secondBreakEnd = secondBreakEnd;
    employeeTime.totalSecondBreakTime = totalSecondBreakTime;

    const updatedEmployeeTime = await employeeTime.save();
    res.status(200).json(updatedEmployeeTime);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteEmployeeTime = async (req, res) => {
  try {
    const employeeTime = await EmployeeTime.findById(req.params.id);
    if (!employeeTime) {
      return res.status(404).json({ message: "Employee time not found" });
    }
    await employeeTime.deleteOne();
    res.status(200).json({ message: "Employee time deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getEmployeeTimeByEmployeeId = async (req, res) => {
  try {
    const employeeTime = await EmployeeTime.find({
      employeeId: req.user._id,
    }).sort({ createdAt: -1 }); // Sort by createdAt in descending order

    if (!employeeTime || employeeTime.length === 0) {
      return res.status(404).json({ message: "Employee time not found" });
    }
    res.status(200).json(employeeTime);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
const updateEmployeeTimeOut = async (req, res) => {
  try {
    // Destructure values from the request body
    const { timeOut, totalHours, notes } = req.body;

    // Build the update object dynamically based on what is provided in the request body
    const updateFields = {};
    if (timeOut) updateFields.timeOut = timeOut;
    if (totalHours) updateFields.totalHours = totalHours;
    if (notes) updateFields.notes = notes;

    // Find and update the employee time record
    const employeeTime = await EmployeeTime.findOneAndUpdate(
      {
        employeeId: req.user._id,
        timeOut: null, // Ensure we only update records where timeOut is null
      },
      updateFields,
      { new: true } // Return the updated document
    );

    if (!employeeTime) {
      return res.status(404).json({ message: "Employee time not found" });
    }

    res.status(200).json(employeeTime);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getEmployeeTimeWithNullTimeOut = async (req, res) => {
  try {
    const employeeTime = await EmployeeTime.find({
      employeeId: req.user._id,
      timeOut: null,
    });
    if (!employeeTime) {
      return res.status(404).json({ message: "Employee time not found" });
    }
    res.status(200).json(employeeTime);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
const searchByNameAndDate = async (req, res) => {
  try {
    const { name, date } = req.query;

    // Basic validation
    if (!name || !date) {
      return res.status(400).json({ message: "Name and date are required" });
    }

    // Convert the date format from 'YYYY-MM-DD' to 'MM/DD/YYYY'
    const parsedDate = new Date(date);
    const formattedDate = `${
      parsedDate.getMonth() + 1
    }/${parsedDate.getDate()}/${parsedDate.getFullYear()}`;

    let query = { date: formattedDate };

    // Handle special CSV filter cases
    const nameLower = name.toLowerCase();
    switch (nameLower) {
      case "csv-all":
        // No additional filters needed
        break;
      case "csv-shift1":
        query.shift = "shift1";
        break;
      case "csv-shift2":
        query.shift = "shift2";
        break;
      case "csv-shift3":
        query.shift = "shift3";
        break;
      case "csv-staff":
        query.shift = "staff";
        break;
      default:
        // Create a case-insensitive regex for partial name matching
        const nameRegex = new RegExp(name, "i");
        query.employeeName = { $regex: nameRegex };
    }

    const employeeTimes = await EmployeeTime.find(query);

    // Handle no records found
    if (employeeTimes.length === 0) {
      return res.status(404).json({ message: "No time records found" });
    }

    res.status(200).json(employeeTimes);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error while fetching time records" });
  }
};
const updateEmployeeTimeBreak = async (req, res) => {
  try {
    // Find and update the employee time record
    const employeeTime = await EmployeeTime.findOneAndUpdate(
      {
        employeeId: req.user._id,
        timeOut: null, // Ensure we only update records where timeOut is null
      },
      {
        breakStart: req.body.breakStart,
        breakEnd: req.body.breakEnd,
        totalBreakTime: req.body.totalBreakTime,
        dateBreakStart: req.body.dateBreakStart,
        dateBreakEnd: req.body.dateBreakEnd,
        secondBreakStart: req.body.secondBreakStart,
        secondBreakEnd: req.body.secondBreakEnd,
        totalSecondBreakTime: req.body.totalSecondBreakTime,
        dateSecondBreakStart: req.body.dateSecondBreakStart,
        dateSecondBreakEnd: req.body.dateSecondBreakEnd,
      },
      { new: true } // Return the updated document
    );

    if (!employeeTime) {
      return res.status(404).json({
        message: "No active time record found for the employee",
      });
    }

    res.status(200).json(employeeTime);
  } catch (error) {
    console.error("Error updating employee time:", error);
    res.status(500).json({
      message: "Failed to update employee time record",
      error: error.message,
    });
  }
};

const updateEmployeeTimelunch = async (req, res) => {
  try {
    // Find and update the employee time record
    const employeeTime = await EmployeeTime.findOneAndUpdate(
      {
        employeeId: req.user._id,
        timeOut: null, // Ensure we only update records where timeOut is null
      },
      {
        lunchStart: req.body.lunchStart,
        lunchEnd: req.body.lunchEnd,
        totalLunchTime: req.body.totalLunchTime,
        dateLunchStart: req.body.dateLunchStart,
        dateLunchEnd: req.body.dateLunchEnd,
      },
      { new: true } // Return the updated document
    );

    if (!employeeTime) {
      return res.status(404).json({
        message: "No active time record found for the employee",
      });
    }

    res.status(200).json(employeeTime);
  } catch (error) {
    console.error("Error updating employee time:", error);
    res.status(500).json({
      message: "Failed to update employee time record",
      error: error.message,
    });
  }
};

const getEmployeeTimeByEmployeeIdandDate = async (req, res) => {
  try {
    const { date } = req.query;
    const employeeTime = await EmployeeTime.findOne({
      employeeId: new mongoose.Types.ObjectId(req.params.id),
      date,
    });

    if (!employeeTime) {
      return res.status(404).json({ message: "Employee time not found" });
    }

    res.status(200).json(employeeTime);
  } catch (error) {
    console.error("Error fetching employee time:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEmployeeTimes,
  createEmployeeTimeIn,
  updateEmployeeTime,
  deleteEmployeeTime,
  createEmployeeTimeOut,
  getEmployeeTimeByEmployeeId,
  updateEmployeeTimeOut,
  getEmployeeTimeWithNullTimeOut,
  searchByNameAndDate,
  updateEmployeeTimeBreak,
  updateEmployeeTimelunch,
  getEmployeeTimeByEmployeeIdandDate,
};
