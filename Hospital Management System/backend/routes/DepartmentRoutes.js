
const express = require("express");
const { FindAllDepartments , FindSingleDepartment, AddDepartment , UpdateDepartment, DeleteDepartment} = require("../controllers/DepartmentController");
const router = express.Router();

router.get("/department", FindAllDepartments);
router.get("/department/:id", FindSingleDepartment);
router.post("/department/create", AddDepartment);
router.put("/department/update/:id", UpdateDepartment);
router.delete("/department/delete/:id", DeleteDepartment);



module.exports = router;