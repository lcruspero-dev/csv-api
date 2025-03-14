const {
  ScheduleEntry,
  AttendanceEntry,
} = require("../models/ScheduleAndAttendanceModel");

// Get all schedule entries
exports.getScheduleEntries = async (req, res) => {
  try {
    const scheduleEntries = await ScheduleEntry.find().populate("employeeId");
    res.status(200).json(scheduleEntries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new schedule entry
exports.createScheduleEntry = async (req, res) => {
  try {
    const newScheduleEntry = new ScheduleEntry({ ...req.body });
    await newScheduleEntry.save();
    res.status(201).json(newScheduleEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a schedule entry
exports.updateScheduleEntry = async (req, res) => {
  const { id } = req.params;
  const { shiftType } = req.body;
  try {
    const updatedScheduleEntry = await ScheduleEntry.findByIdAndUpdate(
      id,
      { shiftType },
      { new: true }
    );
    res.status(200).json(updatedScheduleEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all attendance entries
exports.getAttendanceEntries = async (req, res) => {
  try {
    const attendanceEntries = await AttendanceEntry.find().populate(
      "employeeId"
    );
    res.status(200).json(attendanceEntries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new attendance entry
exports.createAttendanceEntry = async (req, res) => {
  const { employeeId, date, status, checkinTime, checkoutTime } = req.body;
  try {
    const newAttendanceEntry = new AttendanceEntry({
      employeeId,
      date,
      status,
      checkinTime,
      checkoutTime,
    });
    await newAttendanceEntry.save();
    res.status(201).json(newAttendanceEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an attendance entry
exports.updateAttendanceEntry = async (req, res) => {
  const { id } = req.params;
  const { status, checkinTime, checkoutTime } = req.body;
  try {
    const updatedAttendanceEntry = await AttendanceEntry.findByIdAndUpdate(
      id,
      { status, checkinTime, checkoutTime },
      { new: true }
    );
    res.status(200).json(updatedAttendanceEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
