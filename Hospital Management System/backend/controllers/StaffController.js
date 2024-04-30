// backend/controllers/StaffController.js

const Staff = require('../models/Staff');

const FindAllStaff = async (req, res) => {
    try {
        const staff = await Staff.findAll();
        res.json(staff);
    } catch (error) {
        console.error('Error fetching all emergency contact:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const FindSingleStaff = async (req, res) => {
    try {
        const staff = await Staff.findByPk(req.params.id);
        if (!staff) {
            res.status(404).json({ error: 'Emergency Contact not found' });
            return;
        }
        res.json(staff);
    } catch (error) {
        console.error('Error fetching single medicine:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const AddStaff = async (req, res) => {
    try {
        const { Emp_ID, Emp_Fname, Emp_Lname, Joining_Date,Emp_type,Email,Address,Dept_ID,SSN,DOB,Date_Separation} = req.body;
        const newStaff = await Staff.create({
            Emp_ID,
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
        res.json({ success: true, message: 'Staff  added successfully', data: newStaff });
    } catch (error) {
        console.error('Error adding Staff:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const UpdateStaff = async (req, res) => {
    try {
        const {Emp_ID, Emp_Fname, Emp_Lname, Joining_Date,Emp_type,Email,Address,Dept_ID,SSN,DOB,Date_Separation} = req.body;
        const updated = await Staff.update(
            {Emp_ID, Emp_Fname, Emp_Lname, Joining_Date,Emp_type,Email,Address,Dept_ID,SSN,DOB,Date_Separation},
            { where: { Emp_ID: req.params.id } }
        );
        if (updated[0] === 0) {
            res.status(404).json({ error: 'Staff not found or not updated' });
            return;
        }
        res.json({ success: true, message: 'Staff updated successfully' });
    } catch (error) {
        console.error('Error updating Staff:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const DeleteStaff = async (req, res) => {
    try {
        const deleted = await Staff.destroy({
            where: { Emp_ID: req.params.id },
        });
        if (deleted === 0) {
            res.status(404).json({ error: 'Emergency Contact not found' });
            return;
        }
        res.json({ success: true, message: 'Emergency Contact deleted successfully' });
    } catch (error) {
        console.error('Error deleting Emergency Contact:', error);
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

module.exports = {
    FindAllStaff,
    FindSingleStaff,
    AddStaff,
    UpdateStaff,
    DeleteStaff,
    CheckStaffExistence
};
