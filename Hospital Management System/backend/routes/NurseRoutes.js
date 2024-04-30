const express = require("express");
const {
    FindAllNurses,
    FindSingleNurse,
    AddNurse,
    UpdateNurse,
    DeleteNurse

} = require("../controllers/NurseController");

const router = express.Router();

router.get("/nurse", FindAllNurses);
router.get("/nurse/:id", FindSingleNurse);
router.post("/nurse/create", AddNurse);
router.put("/nurse/update/:id", UpdateNurse);
router.delete("/nurse/delete/:id", DeleteNurse);

module.exports = router;




