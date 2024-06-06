const Nurse = require('../models/Nurse');
const Patient = require('../models/Patient');
const Staff = require('../models/Staff');

const FindAllNurses = async (req, res) => {
    try {
        const nurses = await Nurse.findAll();
        res.json(nurses);
    } catch (error) {
        console.error('Error fetching all nurses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const FindSingleNurse = async (req, res) => {
    const { id } = req.params;
    try {
        const nurse = await Nurse.findByPk(id, {
            include: [
                { model: Patient, attributes: ['Patient_Fname', 'Patient_Lname'] },
                { model: Staff, attributes: ['Emp_Fname', 'Emp_Lname'] }
            ]
        });

        if (!nurse) {
            return res.status(404).json({ error: 'Nurse not found' });
        }

        res.json(nurse);
    } catch (error) {
        console.error('Error fetching nurse:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const AddNurse = async (req, res) => {
    const { Patient_ID, Emp_ID } = req.body;
    try {
        const patient = await Patient.findByPk(Patient_ID);
        const staff = await Staff.findByPk(Emp_ID);

        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        if (!staff) {
            return res.status(404).json({ error: 'Staff not found' });
        }

        const nurse = await Nurse.create({
            Patient_ID,
            Emp_ID,
        });

        res.status(201).json(nurse);
    } catch (error) {
        console.error('Error creating nurse:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const UpdateNurse = async (req, res) => {
    try {
        const { Patient_ID, Emp_ID } = req.body;
        const updated = await Nurse.update(
            { Patient_ID, Emp_ID },
            { where: { Nurse_ID: req.params.id } }
        );
        if (updated[0] === 0) {
            res.status(404).json({ error: 'Nurse not found or not updated' });
            return;
        }
        res.json({ success: true, message: 'Nurse updated successfully' });
    } catch (error) {
        console.error('Error updating Nurse:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const DeleteNurse = async (req, res) => {
    try {
        const deleted = await Nurse.destroy({
            where: { Nurse_ID: req.params.id },
        });
        if (deleted === 0) {
            res.status(404).json({ error: 'Nurse not found' });
            return;
        }
        res.json({ success: true, message: 'Nurse deleted successfully' });
    } catch (error) {
        console.error('Error deleting nurse:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const FindNursesByPatientId = async (req, res) => {
    const { patientId } = req.params;
    try {
        const nurses = await Nurse.findAll({
            where: { Patient_ID: patientId },
            include: [
                { model: Patient, attributes: ['Patient_Fname', 'Patient_Lname'] },
                { model: Staff, attributes: ['Emp_Fname', 'Emp_Lname'] }
            ]
        });

        if (!nurses.length) {
            return res.status(404).json({ error: 'Nurses not found' });
        }

        res.json(nurses);
    } catch (error) {
        console.error('Error fetching Nurses by patient ID:', error.message);
        console.error(error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    FindAllNurses,
    FindSingleNurse,
    AddNurse,
    UpdateNurse,
    DeleteNurse,
    FindNursesByPatientId
};
