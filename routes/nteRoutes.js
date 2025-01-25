const router = require("express").Router();
const nteController = require("../controllers/nteController");
const { protect, verifyAdmin } = require("../middleware/authMiddleware");

// Role verification middleware for TL/TM/Admin
const verifyTeamRole = (req, res, next) => {
  if (req.user.isAdmin || req.user.role === "TL" || req.user.role === "TM") {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized");
  }
};

// Basic CRUD routes - restricted to TL/TM/Admin
router.post("/", protect, verifyTeamRole, nteController.createNte);
router.get("/", protect, verifyTeamRole, nteController.getNtes);
router.get("/:id", protect, nteController.getNte);
router.put("/:id", protect, nteController.updateNte);
router.delete("/:id", protect, verifyTeamRole, nteController.deleteNte);

module.exports = router;
