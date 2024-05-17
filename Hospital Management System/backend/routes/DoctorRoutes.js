const express = require("express");
const {
    FindAllDoctors,
    FindSingleDoctor,
    AddDoctor,
    UpdateDoctor,
    DeleteDoctor
} = require("../controllers/DoctorController");

const router = express.Router();

router.get("/doctors", FindAllDoctors);
router.get("/doctors/:id", FindSingleDoctor);
router.post("/doctors/create", AddDoctor);
router.put("/doctors/update/:id", UpdateDoctor);
router.delete("/doctors/delete/:id", DeleteDoctor);

module.exports = router;
