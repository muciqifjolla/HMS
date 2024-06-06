const express = require("express");
const {
    FindAllNurses,
    FindSingleNurse,
    AddNurse,
    UpdateNurse,
    DeleteNurse,
    FindNursesByPatientId
} = require("../controllers/NurseController");
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.get("/nurse", authenticateToken(['admin', 'doctor', 'patient']), FindAllNurses);
router.get("/nurse/:id", authenticateToken(['admin', 'doctor', 'patient']), FindSingleNurse);
router.post("/nurse/create", authenticateToken(['admin', 'doctor', 'patient']), AddNurse);
router.put("/nurse/update/:id", authenticateToken(['admin', 'doctor', 'patient']), UpdateNurse);
router.delete("/nurse/delete/:id", authenticateToken(['admin', 'doctor', 'patient']), DeleteNurse);
router.get("/nurse/patient/:patientId", authenticateToken(['admin', 'doctor', 'patient']), FindNursesByPatientId);

module.exports = router;
