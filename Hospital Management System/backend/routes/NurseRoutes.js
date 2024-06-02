const express = require("express");
const {
    FindAllNurses,
    FindSingleNurse,
    AddNurse,
    UpdateNurse,
    DeleteNurse

} = require("../controllers/NurseController");
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.get("/nurse",authenticateToken(['admin','doctor', 'receptionist']), FindAllNurses);
router.get("/nurse/:id",authenticateToken(['admin','doctor', 'receptionist']), FindSingleNurse);
router.post("/nurse/create",authenticateToken(['admin','doctor', 'receptionist']), AddNurse);
router.put("/nurse/update/:id", authenticateToken(['admin','doctor', 'receptionist']),UpdateNurse);
router.delete("/nurse/delete/:id", DeleteNurse);

module.exports = router;




