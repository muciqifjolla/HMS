const express = require("express");
const {
    FindAllInsurance,
    FindSingleInsurance,
    AddInsurance,
    UpdateInsurance,
    DeleteInsurance
} = require("../controllers/InsuranceController");

const router = express.Router();

router.get("/insurance", FindAllInsurance);
router.get("/insurance/:id", FindSingleInsurance);
router.post("/insurance/create", AddInsurance);
router.put("/insurance/update/:id", UpdateInsurance);
router.delete("/insurance/delete/:id", DeleteInsurance);

module.exports = router;
