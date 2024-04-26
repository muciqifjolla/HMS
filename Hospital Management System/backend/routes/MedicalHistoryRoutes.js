const express = require("express");
const{ 
        FindAllMedicalHistorys, 
        FindSingleMedicalHistory, 
        AddMedicalHistory, 
        UpdateMedicalHistory, 
        DeleteMedicalHistory
     } = require("../controllers/MedicalHistoryController");

     
const router = express.Router();

router.get("/medicalhistory", FindAllMedicalHistorys);
router.get("/medicalhistory/:id", FindSingleMedicalHistory);
router.post("/medicalhistory/create", AddMedicalHistory);
router.put("/medicalhistory/update/:id", UpdateMedicalHistory);
router.delete("/medicalhistory/delete/:id", DeleteMedicalHistory);



module.exports = router;
