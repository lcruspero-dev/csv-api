const asyncHandler = require("express-async-handler");
const Survey = require("../models/surveyModel");
const mongoose = require("mongoose");

// Helper function to check if ObjectId is valid
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createSurvey = asyncHandler(async (req, res) => {
  const { title, description, question, startDate, endDate } = req.body;

  if (!title || !question) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  const survey = new Survey({
    title,
    description,
    question,
    startDate,
    endDate,
    createdBy: req.user._id,
  });

  await survey.save();

  res.status(201).json({
    success: true,
    data: survey,
    message: "Survey created successfully",
  });
});

const getAllSurveys = asyncHandler(async (req, res) => {
  const { status, startDate, endDate } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (startDate) filter.startDate = { $gte: new Date(startDate) };
  if (endDate) filter.endDate = { $lte: new Date(endDate) };

  const surveys = await Survey.find(filter)
    .populate("createdBy", "username email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: surveys.length,
    data: surveys,
  });
});

const getSurveyById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid survey ID",
    });
  }

  const survey = await Survey.findById(id)
    .populate("createdBy", "username email")
    .populate("responses.respondent", "username email");

  if (!survey) {
    return res.status(404).json({
      success: false,
      message: "Survey not found",
    });
  }

  res.status(200).json({
    success: true,
    data: survey,
  });
});

const updateSurvey = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid survey ID",
    });
  }

  const survey = await Survey.findById(id);

  if (!survey) {
    return res.status(404).json({
      success: false,
      message: "Survey not found",
    });
  }

  if (survey.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to update this survey",
    });
  }

  if (survey.status === "closed") {
    return res.status(400).json({
      success: false,
      message: "Cannot update closed survey",
    });
  }

  const updatedSurvey = await Survey.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: updatedSurvey,
    message: "Survey updated successfully",
  });
});

const deleteSurvey = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid survey ID",
    });
  }

  const survey = await Survey.findById(id);

  if (!survey) {
    return res.status(404).json({
      success: false,
      message: "Survey not found",
    });
  }

  if (survey.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to delete this survey",
    });
  }

  await Survey.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Survey deleted successfully",
  });
});

const submitResponse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { feedback, ratingAnswer, isAnonymous } = req.body;

  // Validate feedback and ratingAnswer
  if (!feedback || !ratingAnswer) {
    return res.status(400).json({
      success: false,
      message: "feedback and ratingAnswer are required",
    });
  }

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid survey ID",
    });
  }

  const survey = await Survey.findById(id);

  if (!survey) {
    return res.status(404).json({
      success: false,
      message: "Survey not found",
    });
  }

  if (survey.status !== "active") {
    return res.status(400).json({
      success: false,
      message: "Survey is not active",
    });
  }

  if (
    !isAnonymous &&
    survey.responses.some(
      (response) => response.respondent?.toString() === req.user._id.toString()
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "You have already submitted a response",
    });
  }

  const response = {
    feedback,
    ratingAnswer,
    isAnonymous,
    dateAnswer: new Date(),
  };

  if (!isAnonymous) {
    response.respondent = req.user._id;
    response.username = req.user.name;
  }

  survey.responses.push(response);
  await survey.save();

  res.status(201).json({
    success: true,
    message: "Response submitted successfully",
  });
});

//get all survey with active status
const getAllActiveSurveys = asyncHandler(async (req, res) => {
  const surveys = await Survey.find({ status: "active" });

  if (surveys.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No available survey",
    });
  }

  res.status(200).json({
    success: true,
    data: surveys,
  });
});

module.exports = {
  createSurvey,
  getAllSurveys,
  getSurveyById,
  updateSurvey,
  deleteSurvey,
  submitResponse,
  getAllActiveSurveys,
};
