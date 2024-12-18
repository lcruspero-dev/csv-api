const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Ticket = require("../models/ticketModel");

// @desc    Get user tickets
// @route   GET /api/tickets
// @access  Private
const getTickets = asyncHandler(async (req, res) => {
  // Get user using the id and JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const tickets = await Ticket.find({ user: req.user._id })
    .sort({ createdAt: -1 }) // Sort tickets from new to old
    .populate("user", "name email");

  res.status(200).json(tickets);
});

// @desc    Get user ticket
// @route   GET /api/tickets/:id
// @access  Private
const getTicket = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const ticket = await Ticket.findById(req.params.id).populate("user", "id");

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  // Check if ticket belongs to user or if user is admin
  if (ticket.user._id.toString() !== req.user.id && !req.user.isAdmin) {
    res.status(401);
    throw new Error("Not authorized");
  }

  res.status(200).json(ticket);
});

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private
const createTicket = asyncHandler(async (req, res) => {
  const { category, description, priority, department, assignedTo, file } =
    req.body;

  if (!category || !description || !department) {
    res.status(400);
    throw new Error("Please provide category, description, and department");
  }

  // Validate department
  if (!["HR", "IT"].includes(department)) {
    res.status(400);
    throw new Error("Department must be either HR or IT");
  }

  // Validate priority if provided
  if (
    priority &&
    !["4-Low", "3-Moderate", "2-High", "1-Critical"].includes(priority)
  ) {
    res.status(400);
    throw new Error("Invalid priority level");
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const ticket = await Ticket.create({
    user: req.user.id,
    name: req.user.name,
    category,
    description,
    status: "open",
    priority: priority || "4-Low",
    assignedTo: assignedTo || "Not Assigned",
    file,
    department,
  });

  res.status(201).json(ticket);
});

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private
const deleteTicket = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  await ticket.deleteOne();

  res.status(200).json({ success: true });
});

// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Private
const updateTicket = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  // Validate status if provided
  if (
    req.body.status &&
    !["open", "closed", "In Progress"].includes(req.body.status)
  ) {
    res.status(400);
    throw new Error("Invalid status value");
  }

  // Validate priority if provided
  if (
    req.body.priority &&
    !["4-Low", "3-Moderate", "2-High", "1-Critical"].includes(req.body.priority)
  ) {
    res.status(400);
    throw new Error("Invalid priority value");
  }

  // Validate department if provided
  if (req.body.department && !["HR", "IT"].includes(req.body.department)) {
    res.status(400);
    throw new Error("Department must be either HR or IT");
  }

  const updatedTicket = await Ticket.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate("user", "name email");

  res.status(200).json(updatedTicket);
});

// @desc    View all tickets
// @route   GET /api/tickets/all
// @access  Private (Admin)
const viewAllTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find()
    .sort({ createdAt: -1 })
    .populate("user", "name email");
  res.status(200).json(tickets);
});

// @desc    View open tickets
// @route   GET /api/tickets/open
// @access  Private
const viewOpenTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({
    status: { $in: ["open", "In Progress"] },
  })
    .sort({ createdAt: -1 })
    .populate("user", "name email");
  res.status(200).json(tickets);
});

// @desc    View closed tickets
// @route   GET /api/tickets/closed
// @access  Private
const viewClosedTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({ status: "closed" })
    .sort({ createdAt: -1 })
    .populate("user", "name email");
  res.status(200).json(tickets);
});

// @desc    View tickets by department
// @route   GET /api/tickets/department/:dept
// @access  Private
const viewTicketsByDepartment = asyncHandler(async (req, res) => {
  const { dept } = req.params;

  if (!["HR", "IT"].includes(dept)) {
    res.status(400);
    throw new Error("Invalid department");
  }

  const tickets = await Ticket.find({ department: dept })
    .sort({ createdAt: -1 })
    .populate("user", "name email");
  res.status(200).json(tickets);
});

// @desc    View tickets by priority
// @route   GET /api/tickets/priority/:level
// @access  Private
const viewTicketsByPriority = asyncHandler(async (req, res) => {
  const { level } = req.params;

  if (!["4-Low", "3-Moderate", "2-High", "1-Critical"].includes(level)) {
    res.status(400);
    throw new Error("Invalid priority level");
  }

  const tickets = await Ticket.find({ priority: level })
    .sort({ createdAt: -1 })
    .populate("user", "name email");
  res.status(200).json(tickets);
});

const viewTicketsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;

  const tickets = await Ticket.find({ category })
    .sort({ createdAt: -1 })
    .populate("user", "name email");
  res.status(200).json(tickets);
});

module.exports = {
  getTickets,
  createTicket,
  getTicket,
  deleteTicket,
  updateTicket,
  viewAllTickets,
  viewOpenTickets,
  viewClosedTickets,
  viewTicketsByDepartment,
  viewTicketsByPriority,
  viewTicketsByCategory,
};
