const express = require("express");
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const{ 
        FindAllPatients, 
        FindSinglepatientPatient, 
        AddPatient, 
        UpdatePatient, 
        DeletePatient,
        CheckPatientExistence, 
        FindPatientByPersonalNumber
     } = require("../controllers/PatientController");

     


router.get("/patient", authenticateToken(['admin', 'doctor', 'patient']), FindAllPatients);
router.get("/patient/:id", authenticateToken(['admin', 'doctor', 'patient']), FindSinglepatientPatient);
router.post("/patient/create", authenticateToken(['admin', 'doctor', 'patient']), AddPatient);
router.put("/patient/update/:id", authenticateToken(['admin', 'doctor', 'patient']), UpdatePatient);
router.delete("/patient/delete/:id", DeletePatient);
router.get('/patient/check/:id', authenticateToken(['admin', 'doctor', 'patient']), CheckPatientExistence); 
router.get(`/patient/personalNumber/:personalNumber`, authenticateToken(['admin', 'doctor', 'patient']), FindPatientByPersonalNumber);




module.exports = router;
