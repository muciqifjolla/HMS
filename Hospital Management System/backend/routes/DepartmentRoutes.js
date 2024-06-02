const express = require("express");
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const {
    FindSingleDepartment,
    FindAllDepartments,
    AddDepartment,
    UpdateDepartment,
    DeleteDepartment
} = require("../controllers/DepartmentController");


router.get("/department", authenticateToken(['admin', 'doctor', 'patient']), FindAllDepartments);
router.get("/department/:id", authenticateToken(['admin', 'doctor', 'patient']), FindSingleDepartment);
router.post("/department/create", authenticateToken(['admin', 'doctor', 'patient']), AddDepartment);
router.put("/department/update/:id", authenticateToken(['admin', 'doctor', 'patient']), UpdateDepartment);
router.delete("/department/delete/:id", DeleteDepartment);



module.exports = router;