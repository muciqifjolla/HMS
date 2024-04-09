const express = require("express");
const { FindSingleMedicine,FindAllMedicine, AddMedicine , UpdateMedicine, DeleteMedicine } = require("../controllers/MedicineController");
const router = express.Router();

router.get("/medicine", FindAllMedicine);
router.get("/medicine/:id", FindSingleMedicine);
router.post("/medicine/create", AddMedicine);
router.put("/medicine/update/:id", UpdateMedicine);
router.delete("/medicine/delete/:id", DeleteMedicine);



module.exports = router;
