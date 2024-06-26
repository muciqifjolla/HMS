const express = require("express");
const {
    FindAllBills,
    FindSingleBill,
    AddBill,
    UpdateBill,
    DeleteBill
} = require("../controllers/BillController");
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get("/bills", authenticateToken(['admin', 'doctor', 'patient']), FindAllBills);
router.get("/bills/:id", authenticateToken(['admin', 'doctor', 'patient']), FindSingleBill);
router.post("/bills/create", authenticateToken(['admin', 'doctor', 'patient']), AddBill);
router.put("/bills/update/:id", authenticateToken(['admin', 'doctor']), UpdateBill);
router.delete("/bills/delete/:id", DeleteBill);

module.exports = router;
