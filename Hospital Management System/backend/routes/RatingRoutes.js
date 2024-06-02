const express = require("express");
const {
    FindAllRating,
    FindSingleRating,
    AddRating,
    UpdateRating,
    DeleteRating
} = require("../controllers/RatingController");
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.get("/rating", authenticateToken(['admin', 'doctor', 'patient']), FindAllRating);
router.get("/rating/:id", authenticateToken(['admin', 'doctor', 'patient']), FindSingleRating);
router.post("/rating/create",  authenticateToken(['admin', 'doctor', 'patient']), AddRating);
router.put("/rating/update/:id",  authenticateToken(['admin', 'doctor', 'patient']), UpdateRating);
router.delete("/rating/delete/:id", DeleteRating);

module.exports = router;
