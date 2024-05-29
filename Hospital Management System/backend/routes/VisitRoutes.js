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

router.get("/visit", authenticateToken(['admin', 'doctor', 'receptionist']), FindAllVisits);
router.get("/visit/:id", authenticateToken(['admin', 'doctor', 'receptionist']), FindSingleVisit);
router.post("/visit/create", authenticateToken(['admin', 'doctor', 'receptionist']), createVisit);
router.put("/visit/update/:id", authenticateToken(['admin', 'doctor', 'receptionist']), UpdateVisit);
router.get("/visit/patient/:patientId", authenticateToken(['admin', 'doctor', 'receptionist']), FindVisitsByPatientId);
router.delete("/visit/delete/:id", DeleteVisit);

module.exports = router;
