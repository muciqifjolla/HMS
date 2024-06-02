const express = require("express");
const {
    FindAllDoctors,
    FindSingleDoctor,
    AddDoctor,
    UpdateDoctor,
    DeleteDoctor,
    getAllDoctors
} = require("../controllers/DoctorController");
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get("/doctors", authenticateToken(['admin', 'doctor', 'patient']), FindAllDoctors);
router.get("/doctors/:id", authenticateToken(['admin', 'doctor', 'patient']), FindSingleDoctor);
router.post("/doctors/create", authenticateToken(['admin', 'doctor', 'patient']), AddDoctor);
router.put("/doctors/update/:id", authenticateToken(['admin', 'doctor', 'patient']), UpdateDoctor);
router.delete("/doctors/delete/:id", DeleteDoctor);
router.get('/doctor', authenticateToken(['admin', 'doctor', 'patient']), getAllDoctors);

module.exports = router;
