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
    FindNurses,
    FindDoctors,
    getDoctorData
} = require("../controllers/StaffController");

router.get("/staff", authenticateToken(['admin', 'doctor', 'patient']), FindAllStaff);
router.get("/staff/nurses", authenticateToken(['admin', 'doctor', 'patient']), FindNurses); 
router.get("/staff/doctors", authenticateToken(['admin', 'doctor', 'patient']), FindDoctors); 
router.get("/staff/:id", authenticateToken(['admin', 'doctor', 'patient']), FindSingleStaff);
router.post("/staff/create", authenticateToken(['admin', 'doctor', 'patient']), AddStaff);
router.put("/staff/update/:id", authenticateToken(['admin', 'doctor', 'patient']), UpdateStaff);
router.delete("/staff/delete/:id", authenticateToken(['admin']), DeleteStaff);
router.get('/staff/check/:id', authenticateToken(['admin', 'doctor', 'patient']), CheckStaffExistence);
router.get('/doctor/data', authenticateToken(['admin','doctor']), getDoctorData); // New route

module.exports = router;
