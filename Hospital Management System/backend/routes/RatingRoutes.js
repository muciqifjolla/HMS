const express = require("express");
const {
    FindAllRating,
    FindSingleRating,
    AddRating,
    UpdateRating,
    DeleteRating
} = require("../controllers/RatingController");

const router = express.Router();

router.get("/rating", FindAllRating);
router.get("/rating/:id", FindSingleRating);
router.post("/rating/create", AddRating);
router.put("/rating/update/:id", UpdateRating);
router.delete("/rating/delete/:id", DeleteRating);

module.exports = router;
