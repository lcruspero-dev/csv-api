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
    employeeTime.employeeId = req.body.employeeId;
    employeeTime.timeIn = req.body.timeIn;
    employeeTime.timeOut = req.body.timeOut;
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

module.exports = {
  getEmployeeTimes,
  createEmployeeTimeIn,
  updateEmployeeTime,
  deleteEmployeeTime,
  createEmployeeTimeOut,
  getEmployeeTimeByEmployeeId,
  updateEmployeeTimeOut,
  getEmployeeTimeWithNullTimeOut,
};
