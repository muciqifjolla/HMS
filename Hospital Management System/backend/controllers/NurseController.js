const Nurse = require('../models/Nurse');

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
    try {
        const nurse = await Nurse.findByPk(req.params.id);
        if (!nurse) {
            res.status(404).json({ error: 'Nurse not found' });
            return;
        }
        res.json(nurse);
    } catch (error) {
        console.error('Error fetching single nurse:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const AddNurse = async (req, res) => {
    try {
        const {Patient_ID, Emp_ID } = req.body;
        
        const newNurse = await Nurse.create({
            Patient_ID,
            Emp_ID,
        });
        res.json({ success: true, message: 'Nurse added successfully', data: newNurse });
    } catch (error) {
        console.error('Error adding nurse:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const UpdateNurse = async (req, res) => {
    try {
        const { Patient_ID, Emp_ID } = req.body;
        const updated = await Nurse.update(
            { Patient_ID, Emp_ID },
            { where: { Nurse_ID : req.params.id } }
        );
        if (updated[0] === 0) {
            res.status(404).json({ error: 'Nurse not found or not updated' });
            return;
        }
        res.json({ success: true, message: 'Nurse updated successfully' });
    } catch (error) {
        console.error('Error updating nurse:', error);
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

module.exports = {
    FindAllNurses,
    FindSingleNurse,
    AddNurse,
    UpdateNurse,
    DeleteNurse,
};
