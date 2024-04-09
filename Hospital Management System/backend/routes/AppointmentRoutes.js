const express = require("express");
const { FindAllAppointments , FindSingleAppointment, AddAppointment , UpdateAppointment, DeleteAppointment} = require("../controllers/AppointmentController");
const router = express.Router();

router.get("/appointment", FindAllAppointments);
router.get("/appointment/:id", FindSingleAppointment);
router.post("/appointment/create", AddAppointment);
router.put("/appointment/update/:id", UpdateAppointment);
router.delete("/appointment/delete/:id", DeleteAppointment);



module.exports = router;
