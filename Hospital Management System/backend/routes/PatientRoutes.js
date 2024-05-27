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

     


router.get("/patient", authenticateToken(['admin','doctor', 'receptionist']), FindAllPatients);
router.get("/patient/:id", authenticateToken(['admin','doctor', 'receptionist']), FindSinglepatientPatient);
router.post("/patient/create", authenticateToken(['admin','doctor', 'receptionist']), AddPatient);
router.put("/patient/update/:id", authenticateToken(['admin','doctor', 'receptionist']), UpdatePatient);
router.delete("/patient/delete/:id", DeletePatient);
router.get('/patient/check/:id', authenticateToken(['admin','doctor', 'receptionist']), CheckPatientExistence); 
router.get(`/patient/personalNumber/:personalNumber`, authenticateToken(['admin','doctor', 'receptionist']), FindPatientByPersonalNumber);




module.exports = router;
