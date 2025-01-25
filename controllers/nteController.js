const asyncHandler = require("express-async-handler");
const Nte = require("../models/nteModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

// Authorization middleware
const canUpdateNte = (user) => {
  return user.isAdmin || user.role === "TL" || user.role === "TM";
};

const canUpdateFeedbackAndDecision = (user, nte) => {
  return (
    canUpdateNte(user) || nte.nte.employeeId.toString() === user._id.toString()
  );
};

// Get all NTEs
const getNtes = asyncHandler(async (req, res) => {
  const ntes = await Nte.find()
    .populate("nte.employeeId", "name email")
    .sort({ createdAt: -1 });

  if (!ntes) {
    res.status(404);
    throw new Error("NTEs not found");
  }
  res.status(200).json(ntes);
});

// Get single NTE
const getNte = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid NTE ID");
  }

  const nte = await Nte.findById(id).populate("nte.employeeId", "name email");
  if (!nte) {
    res.status(404);
    throw new Error("NTE not found");
  }
  res.status(200).json(nte);
});

// Create NTE - Only admin/TL/TM
const createNte = asyncHandler(async (req, res) => {
  const { nte } = req.body;

  // Check if user has permission to create NTE
  if (!canUpdateNte(req.user)) {
    res.status(403);
    throw new Error("Not authorized to create NTE");
  }

  // Validate required fields
  if (
    !nte ||
    !nte.employeeId ||
    !nte.name ||
    !nte.position ||
    !nte.dateIssued ||
    !nte.issuedBy ||
    !nte.offenseType ||
    !nte.offenseDescription
  ) {
    res.status(400);
    throw new Error("Please provide all required NTE fields");
  }

  // Create the new NTE document
  const newNte = await Nte.create({
    nte: {
      employeeId: nte.employeeId,
      name: nte.name,
      position: nte.position,
      dateIssued: nte.dateIssued,
      issuedBy: nte.issuedBy,
      offenseType: nte.offenseType,
      offenseDescription: nte.offenseDescription,
    },
  });

  // Populate the `employeeId` field
  // const populatedNte = await Nte.findById(newNte._id).populate(
  //   "nte.employeeId"
  // );

  res.status(201).json(newNte);
});

// Update NTE sections
const updateNte = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nte, employeeFeedback, noticeOfDecision } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid NTE ID");
  }

  const existingNte = await Nte.findById(id);
  if (!existingNte) {
    res.status(404);
    throw new Error("NTE not found");
  }

  let updateData = {};

  // Handle NTE section update
  if (nte) {
    if (!canUpdateNte(req.user)) {
      res.status(403);
      throw new Error("Not authorized to update NTE section");
    }
    updateData.nte = { ...existingNte.nte, ...nte };
  }

  // Handle Employee Feedback and Notice of Decision updates
  if (employeeFeedback || noticeOfDecision) {
    if (!canUpdateFeedbackAndDecision(req.user, existingNte)) {
      res.status(403);
      throw new Error("Not authorized to update feedback or decision");
    }
    if (employeeFeedback) updateData.employeeFeedback = employeeFeedback;
    if (noticeOfDecision) updateData.noticeOfDecision = noticeOfDecision;
  }

  const updatedNte = await Nte.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedNte);
});

// Delete NTE - Only admin/TL/TM
const deleteNte = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!canUpdateNte(req.user)) {
    res.status(403);
    throw new Error("Not authorized to delete NTE");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid NTE ID");
  }

  const nte = await Nte.findById(id);
  if (!nte) {
    res.status(404);
    throw new Error("NTE not found");
  }

  await nte.deleteOne();
  res.status(200).json({ message: "NTE deleted successfully" });
});

module.exports = {
  getNtes,
  getNte,
  createNte,
  updateNte,
  deleteNte,
};
