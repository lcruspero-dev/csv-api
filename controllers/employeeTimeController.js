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
    const timeIn = new Date();
    const employeeTime = await EmployeeTime.create({
      employeeId: req.user._id,
      employeeName: req.user.name,
      timeIn,
    });
    res.status(201).json(employeeTime);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// const createEmployeeTimeOut = async (req, res) => {
//   try {
//     const employeeTime = await EmployeeTime.findOne({ employeeId: req.user._id });
//     if (!employeeTime) {
//       return res.status(404).json({ message: "Employee time not found" });
//     }
//     employeeTime.timeOut = new Date();
//     await employeeTime.save();
//     res.status(200).json(employeeTime);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// };
const createEmployeeTimeOut = async (req, res) => {
  try {
    const employeeTime = await EmployeeTime.findById(req.params.id);
    if (!employeeTime) {
      return res.status(404).json({ message: "Employee time not found" });
    }

    // Set the timeOut to the current date and time
    employeeTime.timeOut = new Date();

    // Manually calculate total time rendered in minutes
    if (employeeTime.timeIn) {
      const duration = (employeeTime.timeOut - employeeTime.timeIn) / 1000 / 60; // Convert ms to minutes
      employeeTime.totalTimeRendered = Math.max(duration, 0); // Ensure non-negative value
    } else {
      employeeTime.totalTimeRendered = 0; // Default to 0 if timeIn is missing
    }

    // Save the updated record to the database
    await employeeTime.save();

    // Respond with the updated record
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

module.exports = {
  getEmployeeTimes,
  createEmployeeTimeIn,
  updateEmployeeTime,
  deleteEmployeeTime,
  createEmployeeTimeOut,
};
