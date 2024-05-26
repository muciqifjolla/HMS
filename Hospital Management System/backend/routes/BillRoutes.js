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

router.get("/bills",authenticateToken(['admin','receptionist']), FindAllBills);
router.get("/bills/:id", authenticateToken(['admin','receptionist']), FindSingleBill);
router.post("/bills/create",authenticateToken(['admin', 'receptionist']), AddBill);
router.put("/bills/update/:id",authenticateToken(['admin', 'receptionist']), UpdateBill);
router.delete("/bills/delete/:id", DeleteBill);

module.exports = router;
