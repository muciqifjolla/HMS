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

router.get("/insurance", authenticateToken(['admin', 'doctor', 'patient']), FindAllInsurance);
router.get("/insurance/:id", authenticateToken(['admin', 'doctor', 'patient']), FindSingleInsurance);
router.post("/insurance/create", authenticateToken(['admin', 'doctor', 'patient']), AddInsurance);
router.put("/insurance/update/:id",  authenticateToken(['admin', 'doctor', 'patient']), UpdateInsurance);
router.delete("/insurance/delete/:id", DeleteInsurance);

module.exports = router;
