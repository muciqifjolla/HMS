const express = require("express");
const{ 
        FindAllMedicalHistorys, 
        FindSingleMedicalHistory, 
        AddMedicalHistory, 
        UpdateMedicalHistory, 
        DeleteMedicalHistory
     } = require("../controllers/MedicalHistoryController");
const { authenticateToken } = require('../middleware/authMiddleware');

     
const router = express.Router();

router.get("/medicalhistory",  authenticateToken(['admin', 'doctor', 'patient']), FindAllMedicalHistorys);
router.get("/medicalhistory/:id",  authenticateToken(['admin', 'doctor', 'patient']), FindSingleMedicalHistory);
router.post("/medicalhistory/create", authenticateToken(['admin', 'doctor', 'patient']), AddMedicalHistory);
router.put("/medicalhistory/update/:id", authenticateToken(['admin', 'doctor', 'patient']), UpdateMedicalHistory);
router.delete("/medicalhistory/delete/:id", DeleteMedicalHistory);



module.exports = router;
