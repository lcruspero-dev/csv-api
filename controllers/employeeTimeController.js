const EmployeeTime = require("../models/employeeTimeModel");

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
    const employeeTime = await EmployeeTime.findById(req.params.id);
    if (!employeeTime) {
      return res.status(404).json({ message: "Employee time not found" });
    }
    employeeTime.date = req.body.date;
    employeeTime.timeIn = req.body.timeIn;
    employeeTime.timeOut = req.body.timeOut;
    employeeTime.totalHours = req.body.totalHours;
    employeeTime.notes = req.body.notes;
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

    // Create a case-insensitive regex for partial name matching
    const nameRegex = new RegExp(name, "i");

    const employeeTimes = await EmployeeTime.find({
      employeeName: { $regex: nameRegex },
      date: formattedDate,
    });

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
    // Destructure all possible values from the request body
    const { breakStart, breakEnd, totalBreakTime } = req.body;

    // Build the update object dynamically based on what is provided
    const updateFields = {};
    // if (timeOut) updateFields.timeOut = timeOut;
    // if (totalHours) updateFields.totalHours = totalHours;
    // if (notes) updateFields.notes = notes;
    if (breakStart) updateFields.breakStart = breakStart;
    if (breakEnd) updateFields.breakEnd = breakEnd;
    if (totalBreakTime) updateFields.totalBreakTime = totalBreakTime;

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
};
