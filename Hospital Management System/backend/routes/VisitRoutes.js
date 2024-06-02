const express = require("express");
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const {
    FindAllVisits,
    FindSingleVisit,
    createVisit,
    UpdateVisit,
    DeleteVisit,
    FindVisitsByPatientId
} = require("../controllers/VisitController");

router.get("/visit", authenticateToken(['admin', 'doctor', 'patient']), FindAllVisits);
router.get("/visit/:id", authenticateToken(['admin', 'doctor', 'patient']), FindSingleVisit);
router.post("/visit/create", authenticateToken(['admin', 'doctor', 'patient']), createVisit);
router.put("/visit/update/:id", authenticateToken(['admin', 'doctor', 'patient']), UpdateVisit);
router.get("/visit/patient/:patientId", authenticateToken(['admin', 'doctor', 'patient']), FindVisitsByPatientId);
router.delete("/visit/delete/:id", DeleteVisit);

module.exports = router;
