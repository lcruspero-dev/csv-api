const {
  ScheduleEntry,
  AttendanceEntry,
  TeamLeaderEntry,
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
    const existingScheduleEntry = await ScheduleEntry.findOne({
      employeeId: req.body.employeeId,
    });
    if (existingScheduleEntry) {
      const updatedScheduleEntry = await ScheduleEntry.findByIdAndUpdate(
        existingScheduleEntry._id,
        { ...req.body },
        { new: true }
      );
      res.status(200).json(updatedScheduleEntry);
    } else {
      const newScheduleEntry = new ScheduleEntry({ ...req.body });
      await newScheduleEntry.save();
      res.status(201).json(newScheduleEntry);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a schedule entry
exports.updateScheduleEntry = async (req, res) => {
  const { id } = req.params;
  const { date, shiftType, startTime, endTime } = req.body;

  try {
    const scheduleEntry = await ScheduleEntry.findOne({ employeeId: id });
    if (!scheduleEntry) {
      return res.status(404).json({ message: "Schedule entry not found" });
    }

    // Check if the date already exists in the schedule array
    const existingSchedule = scheduleEntry.schedule.find(
      (entry) => entry.date === date
    );

    if (existingSchedule) {
      // Update the shiftType for the existing date
      existingSchedule.shiftType = shiftType;
    } else {
      // Add new date and shiftType to the schedule array
      scheduleEntry.schedule.push({ date, shiftType, startTime, endTime });
    }

    // Save the updated document
    await scheduleEntry.save();

    res.status(200).json(scheduleEntry);
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

// Create Team Leader Entry
exports.createTeamLeaderEntry = async (req, res) => {
  try {
    const newTeamLeaderEntry = new TeamLeaderEntry({ ...req.body });
    await newTeamLeaderEntry.save();
    res.status(201).json(newTeamLeaderEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All team leader entries
exports.getAllTeamLeaderEntries = async (req, res) => {
  try {
    const teamLeaderEntries = await TeamLeaderEntry.find();
    res.status(200).json(teamLeaderEntries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkExistingEntry = async (req, res) => {
  try {
    const { employeeId } = req.body;

    const existingEntry = await ScheduleEntry.findOne({
      employeeId,
    });

    if (existingEntry) {
      res.status(200).json({
        exists: true,
        employeeName: existingEntry.employeeName,
        teamLeader: existingEntry.teamLeader,
      });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
