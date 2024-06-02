const MedicalHistory = require('../models/MedicalHistory');
const Patient = require('../models/Patient');

const FindAllMedicalHistorys = async (req, res) => {
    try {
        const medicalHistories = await MedicalHistory.findAll({
            include: {
                model: Patient
            },
        });
        res.json(medicalHistories);
    } catch (error) {
        console.error('Error fetching all medical histories:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const FindSingleMedicalHistory = async (req, res) => {
    try {
        const medicalHistory = await MedicalHistory.findByPk(req.params.id);
        if (!medicalHistory) {
            res.status(404).json({ error: 'Medical history not found' });
            return;
        }
        res.json(medicalHistory);
    } catch (error) {
        console.error('Error fetching single medical history:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const AddMedicalHistory = async (req, res) => {
    try {
        const { Patient_ID, Allergies, Pre_Conditions } = req.body;

        // Validation logic
        if (!Patient_ID || !Allergies || !Pre_Conditions) {
            return res.status(400).json({ error: 'Patient ID, Allergies, and Pre-Conditions are required.' });
        }

   
        
        const newMedicalHistory = await MedicalHistory.create({
            Patient_ID,
            Allergies,
            Pre_Conditions
        });
        res.json({ success: true, message: 'Medical history added successfully', data: newMedicalHistory });
    } catch (error) {
        console.error('Error adding medical history:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const UpdateMedicalHistory = async (req, res) => {
    try {
        const { Patient_ID , Allergies, Pre_Conditions } = req.body;
        const updated = await MedicalHistory.update(
            { Patient_ID , Allergies, Pre_Conditions },
            { where: { Record_ID: req.params.id } } // Assuming id is the primary key of MedicalHistory
        );
        if (updated[0] === 0) {
            res.status(404).json({ error: 'Medical history not found or not updated' });
            return;
        }
        res.json({ success: true, message: 'Medical history updated successfully' });
    } catch (error) {
        console.error('Error updating medical history:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const DeleteMedicalHistory = async (req, res) => {
    try {
        const medicalHistoryId = req.params.id;
        console.log('Deleting medical history with ID:', medicalHistoryId); // Log the ID received from the client

        const deleted = await MedicalHistory.destroy({
            where: { Record_ID: medicalHistoryId }
        });

        if (deleted === 0) {
            res.status(404).json({ error: 'Medical history not found' });
            return;
        }

        res.json({ success: true, message: 'Medical history deleted successfully' });
    } catch (error) {
        console.error('Error deleting medical history:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = {
    FindAllMedicalHistorys,
    FindSingleMedicalHistory,
    AddMedicalHistory,
    UpdateMedicalHistory,
    DeleteMedicalHistory,
};
