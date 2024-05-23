const express = require("express");
const {
    FindAllBills,
    FindSingleBill,
    AddBill,
    UpdateBill,
    DeleteBill
} = require("../controllers/BillController");

const router = express.Router();

router.get("/bills", FindAllBills);
router.get("/bills/:id", FindSingleBill);
router.post("/bills/create", AddBill);
router.put("/bills/update/:id", UpdateBill);
router.delete("/bills/delete/:id", DeleteBill);

module.exports = router;
