const express = require("express");
const {
    FindAllInsurance,
    FindSingleInsurance,
    AddInsurance,
    UpdateInsurance,
    DeleteInsurance
} = require("../controllers/InsuranceController");
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.get("/insurance",authenticateToken(['admin','doctor', 'receptionist']), FindAllInsurance);
router.get("/insurance/:id", authenticateToken(['admin','doctor', 'receptionist']),FindSingleInsurance);
router.post("/insurance/create", authenticateToken(['admin','doctor', 'receptionist']),AddInsurance);
router.put("/insurance/update/:id", authenticateToken(['admin','doctor', 'receptionist']),UpdateInsurance);
router.delete("/insurance/delete/:id", DeleteInsurance);

module.exports = router;
