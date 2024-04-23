const express = require("express");
const{ 
        FindAllPatients, 
        FindSinglepatientPatient, 
        AddPatient, 
        UpdatePatient, 
        DeletePatient
     } = require("../controllers/PatientController");

     
const router = express.Router();

router.get("/patient", FindAllPatients);
router.get("/patient/:id", FindSinglepatientPatient);
router.post("/patient/create", AddPatient);
router.put("/patient/update/:id", UpdatePatient);
router.delete("/patient/delete/:id", DeletePatient);



module.exports = router;
