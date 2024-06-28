const express = require("express");
const { FindAllAppointments, FindSingleAppointment, AddAppointment, UpdateAppointment, DeleteAppointment } = require("../controllers/AppointmentController");
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');

router.get("/appointment", authenticateToken(['admin', 'doctor', 'patient']), FindAllAppointments);
router.get("/appointment/:id", authenticateToken(['admin', 'doctor', 'patient']), FindSingleAppointment);
router.post("/appointment/create", authenticateToken(['admin', 'doctor', 'patient']), AddAppointment);
router.put("/appointment/update/:id", authenticateToken(['admin', 'doctor', 'patient']), UpdateAppointment);
router.delete("/appointment/delete/:id", authenticateToken(['admin', 'doctor']), DeleteAppointment);

module.exports = router;
