const express = require("express");
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');

const {
  
    FindAllStaff,
    FindSingleStaff,
    AddStaff,
    UpdateStaff,
    DeleteStaff,
    CheckStaffExistence
} = require("../controllers/StaffController");




router.get("/staff", authenticateToken(['admin','doctor', 'receptionist']),FindAllStaff);
router.get("/staff/:id",authenticateToken(['admin','doctor', 'receptionist']), FindSingleStaff);
router.post("/staff/create",authenticateToken(['admin','doctor', 'receptionist']), AddStaff);
router.put("/staff/update/:id",authenticateToken(['admin','doctor', 'receptionist']), UpdateStaff);
router.delete("/staff/delete/:id", DeleteStaff);
router.get('/staff/check/:id',authenticateToken(['admin','doctor', 'receptionist']), CheckStaffExistence); 

module.exports = router;
