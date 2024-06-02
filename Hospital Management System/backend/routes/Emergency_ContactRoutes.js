// backend/routes/MedicineRoutes.js
const express = require("express");
const {
    FindAllEmergency_Contact,
    FindSingleEmergency_Contact,
    AddEmergency_Contact,
    UpdateEmergency_Contact,
    DeleteEmergency_Contact
} = require("../controllers/Emergency_ContactController");
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.get("/emergency_contact", authenticateToken(['admin', 'doctor', 'patient']), FindAllEmergency_Contact);
router.get("/emergency_contact/:id", authenticateToken(['admin', 'doctor', 'patient']), FindSingleEmergency_Contact);
router.post("/emergency_contact/create", authenticateToken(['admin', 'doctor', 'patient']), AddEmergency_Contact);
router.put("/emergency_contact/update/:id", authenticateToken(['admin', 'doctor', 'patient']), UpdateEmergency_Contact);
router.delete("/emergency_contact/delete/:id", DeleteEmergency_Contact);

module.exports = router;
