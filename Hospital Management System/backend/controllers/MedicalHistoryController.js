const MedicalHistory = require('../models/MedicalHistory');
const Patient = require('../models/Patient');

const getPatientByEmail = async (email) => {
    try {
        const patient = await Patient.findOne({
            where: { Email: email }
        });

        if (!patient) {
            throw new Error('Patient not found');
        }

        return patient;
    } catch (error) {
        console.error('Error fetching patient by email:', error);
        throw error;
    }
};

const FindAllMedicalHistorys = async (req, res) => {
    try {
        const userEmail = req.user.email;
        const userRole = req.user.role;

        let medicalHistories;
        if (userRole === 'admin') {
            medicalHistories = await MedicalHistory.findAll({
                include: {
                    model: Patient
                },
            });
        } else if (userRole === 'patient') {
            const patient = await getPatientByEmail(userEmail);
            medicalHistories = await MedicalHistory.findAll({
                where: { Patient_ID: patient.Patient_ID },
                include: {
                    model: Patient
                },
            });
        } else {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const medicalHistoriesDataWithNames = medicalHistories.map(medicalHistory => ({
            ...medicalHistory.toJSON(),
            Patient_Name: medicalHistory.Patient ? `${medicalHistory.Patient.Patient_Fname} ${medicalHistory.Patient.Patient_Lname}` : 'Unknown Patient'
        }));

        res.json({ medicalHistories: medicalHistoriesDataWithNames });
    } catch (error) {
        console.error('Error fetching medical histories:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const FindSingleMedicalHistory = async (req, res) => {
    try {
        const medicalHistory = await MedicalHistory.findByPk(req.params.id, {
            include: {
                model: Patient
            }
        });
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
        const { Patient_ID, Allergies, Pre_Conditions } = req.body;
        const updated = await MedicalHistory.update(
            { Patient_ID, Allergies, Pre_Conditions },
            { where: { Record_ID: req.params.id } }
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
