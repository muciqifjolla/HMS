const Patient = require('../models/Patient');
const Medicine = require('../models/Patient');

const FindAllPatients = async (req, res) => {
    try {
        const patients = await Patient.findAll();
        res.json(patients);
    } catch (error) {
        console.error('Error fetching all patients:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const FindSinglepatientPatient = async (req, res) => {
    try {
        const patient = await Patient.findByPk(req.params.id);
        if (!patient) {
            res.status(404).json({ error: 'Patient not found' });
            return;
        }
        res.json(patient);
    } catch (error) {
        console.error('Error fetching single patient:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const AddPatient = async (req, res) => {
    try {
        const { Patient_Fname, Patient_Lname, Blood_type, Email, Gender, Conditionn, Admission_Date, Discharge_Date, Phone } = req.body;
        const newPatient = await Patient.create({
            Patient_Fname,
            Patient_Lname,
            Blood_type,
            Email,
            Gender,
            Conditionn,
            Admission_Date,
            Discharge_Date,
            Phone
        });
        res.json({ success: true, message: 'Patient added successfully', data: newPatient });
    } catch (error) {
        console.error('Error adding patient:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const UpdatePatient = async (req, res) => {
    try {
        const { Patient_Fname, Patient_Lname, Blood_type, Email, Gender, Conditionn, Admission_Date, Discharge_Date, Phone } = req.body;
        const updated = await Patient.update(
            { Patient_Fname, Patient_Lname, Blood_type, Email, Gender, Conditionn, Admission_Date, Discharge_Date, Phone },
            { where: { Patient_ID : req.params.id } }
        );
        if (updated[0] === 0) {
            res.status(404).json({ error: 'Patient not found or not updated' });
            return;
        }
        res.json({ success: true, message: 'Patient updated successfully' });
    } catch (error) {
        console.error('Error updating patient:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const DeletePatient = async (req, res) => {
    try {
        const deleted = await Patient.destroy({
            where: { Patient_ID: req.params.id },
        });
        if (deleted === 0) {
            res.status(404).json({ error: 'Patient not found' });
            return;
        }
        res.json({ success: true, message: 'Patient deleted successfully' });
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    FindAllPatients,
    FindSinglepatientPatient,
    AddPatient,
    UpdatePatient,
    DeletePatient,
};
