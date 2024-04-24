// backend/routes/StaffRoutes.js

const express = require("express");
const {
  
    FindAllStaff,
    FindSingleStaff,
    AddStaff,
    UpdateStaff,
    DeleteStaff
} = require("../controllers/StaffController");

const router = express.Router();

router.get("/staff", FindAllStaff);
router.get("/staff/:id", FindSingleStaff);
router.post("/staff/create", AddStaff);
router.put("/staff/update/:id", UpdateStaff);
router.delete("/staff/delete/:id", DeleteStaff);

module.exports = router;
