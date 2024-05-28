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

router.get("/doctors",authenticateToken(['admin','receptionist']), FindAllDoctors);
router.get("/doctors/:id",authenticateToken(['admin','receptionist']), FindSingleDoctor);
router.post("/doctors/create",authenticateToken(['admin','receptionist']), AddDoctor);
router.put("/doctors/update/:id",authenticateToken(['admin','receptionist']), UpdateDoctor);
router.delete("/doctors/delete/:id", DeleteDoctor);
router.get('/doctor', authenticateToken(['admin','receptionist']), getAllDoctors);

module.exports = router;
