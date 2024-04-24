const Insurance = require('../models/Insurance');

const FindAllInsurance = async (req, res) => {
    try {
        const insurance = await Insurance.findAll();
        res.json(insurance);
    } catch (error) {
        console.error('Error fetching all insurance:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const FindSingleInsurance = async (req, res) => {
    try {
        const insurance = await Insurance.findByPk(req.params.id);
        if (!insurance) {
            res.status(404).json({ error: 'Insurance not found' });
            return;
        }
        res.json(insurance);
    } catch (error) {
        console.error('Error fetching single insurance:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const AddInsurance = async (req, res) => {
    try {
        const {Patient_ID, Ins_Code, End_Date, Provider, Plan, Co_Pay, Coverage, Maternity, Dental, Optical} = req.body;
        const newInsurance = await Insurance.create({
            Patient_ID,
            Ins_Code,
            End_Date,
            Provider,
            Plan,
            Co_Pay,
            Coverage,
            Maternity,
            Dental,
            Optical,
        });
        res.json({ success: true, message: 'Insurance added successfully', data: newInsurance });
    } catch (error) {
        console.error('Error adding insurance:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const UpdateInsurance = async (req, res) => {
    try {
        const { Patient_ID, Ins_Code, End_Date, Provider, Plan, Co_Pay, Coverage, Maternity, Dental, Optical } = req.body;
        const updated = await Insurance.update(
            { Patient_ID, Ins_Code, End_Date, Provider, Plan, Co_Pay, Coverage, Maternity, Dental, Optical },
            { where: { Policy_Number: req.params.id } }
        );
        if (updated[0] === 0) {
            res.status(404).json({ error: 'Insurance not found or not updated' });
            return;
        }
        res.json({ success: true, message: 'Insurance updated successfully' });
    } catch (error) {
        console.error('Error updating insurance:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const DeleteInsurance = async (req, res) => {
    try {
        const deleted = await Insurance.destroy({
            where: { Policy_Number: req.params.id },
        });
        if (deleted === 0) {
            res.status(404).json({ error: 'Insurance not found' });
            return;
        }
        res.json({ success: true, message: 'Insurance deleted successfully' });
    } catch (error) {
        console.error('Error deleting insurance:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    FindAllInsurance,
    FindSingleInsurance,
    AddInsurance,
    UpdateInsurance,
    DeleteInsurance,
};
