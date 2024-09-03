const User = require("../models/userModel");

const asyncHandler = require("express-async-handler");
const Memo = require("../models/memoModel");

const getMemos = asyncHandler(async (req, res) => {
  try {
    const memos = await Memo.find();
    res.status(200).json(memos);
  } catch (error) {
    console.log(error);
    res.status(404);
    throw new Error("Memos not found");
  }
});
const createMemo = asyncHandler(async (req, res) => {
  const { subject, description } = req.body;
  if (!subject || !description) {
    res.status(400);
    throw new Error("Please add all required fields");
  }

  const memo = await Memo.create(req.body);
  res.status(200).json(memo);
});

const updateMemo = asyncHandler(async (req, res) => {
  const memo = await Memo.findById(req.params.id);

  if (!memo) {
    res.status(404);
    throw new Error("Memo not found");
  }

  const { subject, description } = req.body;
  if (!subject || !description) {
    res.status(400);
    throw new Error("Please add all required fields");
  }

  const updatedMemo = await Memo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedMemo);
});

const deleteMemo = asyncHandler(async (req, res) => {
  const memo = await Memo.findById(req.params.id);

  if (!memo) {
    res.status(404);
    throw new Error("Memo not found");
  }

  await memo.remove();

  res.status(200).json({ id: req.params.id });
});

const getMemoById = asyncHandler(async (req, res) => {
  const memo = await Memo.findById(req.params.id);
  if (!memo) {
    res.status(404);
    throw new Error("Memo not found");
  }
  res.status(200).json(memo);
});

module.exports = { getMemos, createMemo, updateMemo, deleteMemo, getMemoById };
