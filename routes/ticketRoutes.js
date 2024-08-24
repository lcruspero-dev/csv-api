const express = require("express");
const router = express.Router();
const {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
  viewAllTickets,
  viewOpenTickets,
  viewClosedTickets,
} = require("../controllers/ticketController");

const { protect, verifyAdmin } = require("../middleware/authMiddleware");

// Re-route into note router
const noteRouter = require("./noteRoutes");
router.use("/:ticketId/notes", noteRouter);

// Routes for viewing tickets based on status
router.get("/viewAll", protect, verifyAdmin, viewAllTickets);
router.get("/viewOpen", protect, verifyAdmin, viewOpenTickets);
router.get("/viewClosed", protect, verifyAdmin, viewClosedTickets);

// Protected route to create and get tickets
router.route("/").get(protect, getTickets).post(protect, createTicket);

// Routes for individual ticket operations
router
  .route("/:id")
  .get(protect, getTicket)
  .put(protect, verifyAdmin, updateTicket)
  .delete(protect, verifyAdmin, deleteTicket);

module.exports = router;
