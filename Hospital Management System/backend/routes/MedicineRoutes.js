const express = require("express");
const {
    FindSingleMedicine,
    FindAllMedicine,
    AddMedicine,
    UpdateMedicine,
    DeleteMedicine
} = require("../controllers/MedicineController");
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.get("/medicine", authenticateToken(['admin', 'doctor', 'patient']), FindAllMedicine);
router.get("/medicine/:id", authenticateToken(['admin', 'doctor', 'patient']), FindSingleMedicine);
router.post("/medicine/create", authenticateToken(['admin', 'doctor', 'patient']), AddMedicine);
router.put("/medicine/update/:id", authenticateToken(['admin', 'doctor', 'patient']), UpdateMedicine);
router.delete("/medicine/delete/:id", DeleteMedicine);

module.exports = router;
