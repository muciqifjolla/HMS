const Visit = require('../models/Visits');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Staff = require('../models/Staff');

const FindAllVisits = async (req, res) => {
    try {
        const visits = await Visit.findAll();
        res.json(visits);
    } catch (error) {
        console.error('Error fetching all visits:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const FindSingleVisit = async (req, res) => {
    const { id } = req.params;
    try {
        const visit = await Visit.findByPk(id, {
            include: [
                { model: Patient, attributes: ['Patient_Fname', 'Patient_Lname'] },
                { model: Doctor, attributes: ['Doctor_ID'], include: [{ model: Staff, attributes: ['Emp_Fname', 'Emp_Lname'] }] }
            ]
        });

        if (!visit) {
            return res.status(404).json({ error: 'Visit not found' });
        }

        res.json(visit);
    } catch (error) {
        console.error('Error fetching visit:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createVisit = async (req, res) => {
    const { Patient_ID, Doctor_ID, date_of_visit, condition, diagnosis, therapy } = req.body;

    try {
        // Optional: Validate if the patient and doctor exist
        const patient = await Patient.findByPk(Patient_ID);
        const doctor = await Doctor.findByPk(Doctor_ID);

        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        const visit = await Visit.create({
            Patient_ID,
            Doctor_ID,
            date_of_visit,
            condition,
            diagnosis,
            therapy
        });

        res.status(201).json(visit);
    } catch (error) {
        console.error('Error creating visit:', error); // Log the error for debugging
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const UpdateVisit = async (req, res) => {
    try {
        const { Patient_ID, Doctor_ID, date_of_visit, condition, diagnosis, therapy } = req.body;
        const updated = await Visit.update(
            { Patient_ID, Doctor_ID, date_of_visit, condition, diagnosis, therapy },
            { where: { Visit_ID: req.params.id } }
        );
        if (updated[0] === 0) {
            res.status(404).json({ error: 'Visit not found or not updated' });
            return;
        }
        res.json({ success: true, message: 'Visit updated successfully' });
    } catch (error) {
        console.error('Error updating visit:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const DeleteVisit = async (req, res) => {
    try {
        const deleted = await Visit.destroy({
            where: { Visit_ID: req.params.id },
        });
        if (deleted === 0) {
            res.status(404).json({ error: 'Visit not found' });
            return;
        }
        res.json({ success: true, message: 'Visit deleted successfully' });
    } catch (error) {
        console.error('Error deleting visit:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const FindVisitsByPatientId = async (req, res) => {
    const { patientId } = req.params;
    try {
        const visits = await Visit.findAll({
            where: { Patient_ID: patientId },
            include: [
                { model: Patient, attributes: ['Patient_Fname', 'Patient_Lname', 'Personal_Number', 'Birth_Date', 'Blood_type', 'Email', 'Gender', 'Phone'] },
                { model: Doctor, attributes: ['Doctor_ID'], include: [{ model: Staff, attributes: ['Emp_Fname', 'Emp_Lname'] }] }
            ]
        });

        if (!visits.length) {
            return res.status(404).json({ error: 'Visits not found' });
        }

        res.json(visits);
    } catch (error) {
        console.error('Error fetching visits by patient ID:', error.message);
        console.error(error.stack); // Log the stack trace for debugging
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = {
    FindAllVisits,
    FindSingleVisit,
    createVisit,
    UpdateVisit,
    DeleteVisit,
    FindVisitsByPatientId
};
