const Staff = require('../models/Staff');
const Department = require('../models/Department');
const { Op } = require('sequelize');
const Visit = require('../models/Visits');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// Utility function to validate email format
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const FindAllStaff = async (req, res) => {
    try {
        const staff = await Staff.findAll({
            include: [{
                model: Department
                // attributes: ['Dept_name'] 
            }]
        });
        res.json(staff);
    } catch (error) {
        console.error('Error fetching all staff:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const FindSingleStaff = async (req, res) => {
    try {
        const staff = await Staff.findByPk(req.params.id);
        if (!staff) {
            res.status(404).json({ error: 'Staff not found' });
            return;
        }
        res.json(staff);
    } catch (error) {
        console.error('Error fetching single staff:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const FindNurses = async (req, res) => {
    try {
        const nurses = await Staff.findAll({
            where: { Emp_type: 'nurse' },
            include: [{
                model: Department,
                attributes: ['Dept_name'] 
            }]
        });
        res.json(nurses);
    } catch (error) {
        console.error('Error fetching nurses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const FindDoctors = async (req, res) => {
    try {
        const doctors = await Staff.findAll({
            where: { Emp_type: 'doctor' },
            include: [{
                model: Department,
                attributes: ['Dept_name'] 
            }]
        });
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const AddStaff = async (req, res) => {
    try {
        const { Emp_Fname, Emp_Lname, Joining_Date, Emp_type, Email, Address, Dept_ID, SSN, DOB, Date_Separation } = req.body;

        // Validate input fields
        if (!Emp_Fname || !Emp_Lname || !Joining_Date || !Emp_type || !Email || !Address || !Dept_ID || !SSN || !DOB || !Date_Separation) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate email format
        if (!validateEmail(Email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Check if the staff member already exists by checking the SSN or Email
        const existingStaff = await Staff.findOne({ where:  { SSN } });
        if (existingStaff) {
            return res.status(400).json({ error: 'Staff member with the same SSN already exists' });
        }

        const department = await Department.findOne({ where: { Dept_ID } });
        if (!department) {
            return res.status(400).json({ error: 'Department not found' });
        }

        const newStaff = await Staff.create({
            Emp_Fname,
            Emp_Lname,
            Joining_Date,
            Emp_type,
            Email,
            Address,
            Dept_ID,
            SSN,
            DOB,
            Date_Separation
        });
        res.json({ success: true, message: 'Staff added successfully', data: newStaff });
    } catch (error) {
        console.error('Error adding staff:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const UpdateStaff = async (req, res) => {
    try {
        const { Emp_Fname, Emp_Lname, Joining_Date, Emp_type, Email, Address, Dept_ID, SSN, DOB, Date_Separation } = req.body;

        // Validate input fields
        if (!Emp_Fname || !Emp_Lname || !Joining_Date || !Emp_type || !Email || !Address || !Dept_ID || !SSN || !DOB || !Date_Separation) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate email format
        if (!validateEmail(Email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const updated = await Staff.update(
            { Emp_Fname, Emp_Lname, Joining_Date, Emp_type, Email, Address, Dept_ID, SSN, DOB, Date_Separation },
            { where: { Emp_ID: req.params.id } }
        );
        if (updated[0] === 0) {
            res.status(404).json({ error: 'Staff not found or not updated' });
            return;
        }
        res.json({ success: true, message: 'Staff updated successfully' });
    } catch (error) {
        console.error('Error updating staff:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const DeleteStaff = async (req, res) => {
    try {
        const deleted = await Staff.destroy({
            where: { Emp_ID: req.params.id },
        });
        if (deleted === 0) {
            res.status(404).json({ error: 'Staff not found' });
            return;
        }
        res.json({ success: true, message: 'Staff deleted successfully' });
    } catch (error) {
        console.error('Error deleting staff:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const CheckStaffExistence = async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await Staff.findByPk(id);
        if (!staff) {
            res.status(404).json({ error: 'Staff not found' });
            return;
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error checking staff existence:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getDoctorByEmail = async (email) => {
    try {
        const doctor = await Doctor.findOne({
            include: [{ model: Staff, where: { Email: email, Emp_type: 'doctor' } }]
        });

        if (!doctor) {
            throw new Error('Doctor not found');
        }

        return doctor;
    } catch (error) {
        console.error('Error fetching doctor by email:', error);
        throw error;
    }
};


const getDoctorData = async (req, res) => {
    try {
        const userEmail = req.user.email;
        const userRole = req.user.role;

        let visits;
        if (userRole === 'admin') {
            visits = await Visit.findAll({
                include: [
                    { model: Patient, attributes: ['Patient_Fname', 'Patient_Lname'] },
                    { 
                        model: Doctor, 
                        attributes: ['Doctor_ID'],
                        include: [{ model: Staff, attributes: ['Emp_Fname', 'Emp_Lname'] }]
                    }
                ]
            });

            const visitsDataWithNames = visits.map(visit => ({
                ...visit.toJSON(),
                Patient_Name: visit.Patient ? `${visit.Patient.Patient_Fname} ${visit.Patient.Patient_Lname}` : 'Unknown Patient',
                Doctor_Name: visit.Doctor && visit.Doctor.Staff ? `${visit.Doctor.Staff.Emp_Fname} ${visit.Doctor.Staff.Emp_Lname}` : 'Unknown Doctor'
            }));

            return res.json({ visits: visitsDataWithNames });
        } else {
            const doctor = await getDoctorByEmail(userEmail);

            visits = await Visit.findAll({
                where: { Doctor_ID: doctor.Doctor_ID }, // Correctly refer to Doctor_ID
                include: [{ model: Patient }]
            });

            const visitsDataWithNames = visits.map(visit => ({
                ...visit.toJSON(),
                Patient_Name: visit.Patient ? `${visit.Patient.Patient_Fname} ${visit.Patient.Patient_Lname}` : 'Unknown Patient',
                Doctor_Name: `${doctor.Staff.Emp_Fname} ${doctor.Staff.Emp_Lname}`
            }));

            return res.json({
                doctor,
                visits: visitsDataWithNames,
            });
        }
    } catch (error) {
        console.error('Error fetching doctor data:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};


module.exports = {
    FindAllStaff,
    FindSingleStaff,
    FindNurses,
    FindDoctors,
    AddStaff,
    UpdateStaff,
    DeleteStaff,
    CheckStaffExistence,
    getDoctorData
};
