const Doctor = require('../models/Doctor');
const Staff = require('../models/Staff');

const FindAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll({
            include: [
                {
                    model: Staff,
                    attributes: ['Emp_Fname', 'Emp_Lname'] // Include only the first name and last name attributes
                }
            ]
        });
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching all doctors:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const FindSingleDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByPk(req.params.id);
        if (!doctor) {
            res.status(404).json({ error: 'Doctor not found' });
            return;
        }
        res.json(doctor);
    } catch (error) {
        console.error('Error fetching single doctor:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const AddDoctor = async (req, res) => {
    try {
        const { Qualifications, Emp_ID, Specialization } = req.body;

        // Validate input fields
        
        if (!Qualifications) {
            return res.status(400).json({ error: 'Qualifications cannot be empty' });
        }
        if (!Emp_ID) {
            return res.status(400).json({ error: 'Emp_ID cannot be empty' });
        }
        if (!Specialization) {
            return res.status(400).json({ error: 'Specialization cannot be empty' });
        }
      

        // Check if the doctor already exists
        const existingDoctor = await Doctor.findOne({ where: { Emp_ID } });
        if (existingDoctor) {
            return res.status(400).json({ error: 'Doctor with the same ID already exists' });
        }

        const newDoctor = await Doctor.create({
            Qualifications,
            Emp_ID,
            Specialization,
            
        });
        res.json({ success: true, message: 'Doctor added successfully', data: newDoctor });
    } catch (error) {
        console.error('Error adding doctor:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const UpdateDoctor = async (req, res) => {
    try {
        const { Qualifications, Emp_ID, Specialization } = req.body;

        // Validation
        if (!Qualifications) {
            return res.status(400).json({ error: 'Qualifications cannot be empty' });
        }
        if (!Emp_ID) {
            return res.status(400).json({ error: 'Emp_ID cannot be empty' });
        }
        if (!Specialization) {
            return res.status(400).json({ error: 'Specialization cannot be empty' });
        }
       

        const updated = await Doctor.update(
            { Qualifications, Emp_ID, Specialization },
            { where: { Doctor_ID: req.params.id } }
        );
        if (updated[0] === 0) {
            res.status(404).json({ error: 'Doctor not found or not updated' });
            return;
        }
        res.json({ success: true, message: 'Doctor updated successfully' });
    } catch (error) {
        console.error('Error updating doctor:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const DeleteDoctor = async (req, res) => {
    try {
        const deleted = await Doctor.destroy({
            where: { Doctor_ID: req.params.id },
        });
        if (deleted === 0) {
            res.status(404).json({ error: 'Doctor not found' });
            return;
        }
        res.json({ success: true, message: 'Doctor deleted successfully' });
    } catch (error) {
        console.error('Error deleting doctor:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll({
            include: [{
                model: Staff,
                attributes: ['Emp_Fname', 'Emp_Lname'],
            }],
        });
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    FindAllDoctors,
    FindSingleDoctor,
    AddDoctor,
    UpdateDoctor,
    DeleteDoctor,
    getAllDoctors
};