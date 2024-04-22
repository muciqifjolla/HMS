// backend/routes/MedicineRoutes.js
const express = require("express");
const {
    FindAllEmergency_Contact,
    FindSingleEmergency_Contact,
    AddEmergency_Contact,
    UpdateEmergency_Contact,
    DeleteEmergency_Contact
} = require("../controllers/Emergency_ContactController");

const router = express.Router();

router.get("/emergency_contact", FindAllEmergency_Contact);
router.get("/emergency_contact/:id", FindSingleEmergency_Contact);
router.post("/emergency_contact/create", AddEmergency_Contact);
router.put("/emergency_contact/update/:id", UpdateEmergency_Contact);
router.delete("/emergency_contact/delete/:id", DeleteEmergency_Contact);

module.exports = router;
