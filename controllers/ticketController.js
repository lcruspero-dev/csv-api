const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const Ticket = require("../models/ticketModel");

// @desc    Get user tickets
// @route   GET /api/tickets
// @access  Private

/**
 * 'asyncHandler' is a simple middleware for handling exceptions
 * inside of async express routes and passing them to your express
 * error handlers.
 */
const getTickets = asyncHandler(async (req, res) => {
  // Get user using the id and JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const tickets = await Ticket.find({ user: req.user._id }).sort({
    createdAt: -1,
  }); // Sort tickets from new to old

  res.status(200).json(tickets);
});

// @desc    Get user ticket
// @route   GET /api/tickets/:id
// @access  Private
const getTicket = asyncHandler(async (req, res) => {
  // Get user using the id and JWT
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

  // Check if ticket belongs to user
  if (ticket.user.toString() !== req.user.id && !req.user.isAdmin) {
    res.status(401);
    throw new Error("Not authorized");
  }

  res.status(200).json(ticket);
});

// @desc    Create new ticket
// @route   POST /api/ticket
// @access  Private
const createTicket = asyncHandler(async (req, res) => {
  const { category, description } = req.body;

  if (!category || !description) {
    res.status(400); // Bad request
    throw new Error("Please provide a category and description");
  }

  // Get user using the id and JWT
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const ticket = await Ticket.create({
    category,
    description,
    user: req.user.id,
    status: "new",
    assignedTo: "Empty",
  });

  res.status(201).json(ticket);
});

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private
const deleteTicket = asyncHandler(async (req, res) => {
  // Get user using the id and JWT
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

  // Check if ticket belongs to user
  // if (ticket.user.toString() !== req.user.id) {
  //   res.status(401);
  //   throw new Error("Not authorized");
  // }

  await ticket.remove();

  res.status(200).json({ success: true });
});

// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Private
const updateTicket = asyncHandler(async (req, res) => {
  // Get user using the id and JWT
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

  // Check if ticket belongs to user
  // if (ticket.user.toString() !== req.user.id) {
  //   res.status(401);
  //   throw new Error("Not authorized");
  // }

  const updatedTicket = await Ticket.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res.status(200).json(updatedTicket);
});

const viewAllTickets = asyncHandler(async (_req, res) => {
  const tickets = await Ticket.find().sort({ createdAt: -1 });
  res.status(200).json(tickets);
});
const viewOpenTickets = asyncHandler(async (_req, res) => {
  const tickets = await Ticket.find({ status: { $in: ["open", "new"] } }).sort({
    createdAt: -1,
  });
  res.status(200).json(tickets);
});
const viewClosedTickets = asyncHandler(async (_req, res) => {
  const tickets = await Ticket.find({ status: "closed" }).sort({
    createdAt: -1,
  });
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
};
