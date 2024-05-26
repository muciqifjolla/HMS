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

router.get("/medicine",authenticateToken(['admin','doctor', 'receptionist']),  FindAllMedicine);
router.get("/medicine/:id",authenticateToken(['admin','doctor', 'receptionist']),  FindSingleMedicine);
router.post("/medicine/create",authenticateToken(['admin','doctor', 'receptionist']),  AddMedicine);
router.put("/medicine/update/:id",authenticateToken(['admin','doctor', 'receptionist']),  UpdateMedicine);
router.delete("/medicine/delete/:id", DeleteMedicine);

module.exports = router;
