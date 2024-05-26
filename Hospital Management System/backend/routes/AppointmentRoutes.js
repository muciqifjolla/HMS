const express = require("express");
const { FindAllAppointments , FindSingleAppointment, AddAppointment , UpdateAppointment, DeleteAppointment} = require("../controllers/AppointmentController");
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');

router.get("/appointment",authenticateToken(['admin','doctor', 'receptionist']), FindAllAppointments);
router.get("/appointment/:id", authenticateToken(['admin','doctor', 'receptionist']), FindSingleAppointment);
router.post("/appointment/create", authenticateToken(['admin', 'receptionist']), AddAppointment);
router.put("/appointment/update/:id",authenticateToken(['admin', 'receptionist']), UpdateAppointment);
router.delete("/appointment/delete/:id", DeleteAppointment);



module.exports = router;
