const express = require("express");
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');

const {
    FindAllStaff,
    FindSingleStaff,
    AddStaff,
    UpdateStaff,
    DeleteStaff,
    CheckStaffExistence,
    FindNurses // Import the new function
} = require("../controllers/StaffController");

router.get("/staff", authenticateToken(['admin', 'doctor', 'patient']), FindAllStaff);
router.get("/staff/nurses", authenticateToken(['admin', 'doctor', 'patient']), FindNurses); // New route
router.get("/staff/:id", authenticateToken(['admin', 'doctor', 'patient']), FindSingleStaff);
router.post("/staff/create", authenticateToken(['admin', 'doctor', 'patient']), AddStaff);
router.put("/staff/update/:id", authenticateToken(['admin', 'doctor', 'patient']), UpdateStaff);
router.delete("/staff/delete/:id", authenticateToken(['admin']), DeleteStaff);
router.get('/staff/check/:id', authenticateToken(['admin', 'doctor', 'patient']), CheckStaffExistence);

module.exports = router;
