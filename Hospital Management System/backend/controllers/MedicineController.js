const Medicine = require('../models/Medicine');

const FindAllMedicine = async (req, res) => {
    try {
        const medicines = await Medicine.findAll();
        res.json(medicines);
    } catch (error) {
        console.error('Error fetching all medicines:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const FindSingleMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findByPk(req.params.id);
        if (!medicine) {
            res.status(404).json({ error: 'Medicine not found' });
            return;
        }
        res.json(medicine);
    } catch (error) {
        console.error('Error fetching single medicine:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const AddMedicine = async (req, res) => {
    try {
        const { M_name, M_Quantity, M_Cost } = req.body;
        const newMedicine = await Medicine.create({
            M_name,
            M_Quantity,
            M_Cost,
        });
        res.json({ success: true, message: 'Medicine added successfully', data: newMedicine });
    } catch (error) {
        console.error('Error adding medicine:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const UpdateMedicine = async (req, res) => {
    try {
        const { M_name, M_Quantity, M_Cost } = req.body;
        const updated = await Medicine.update(
            { M_name, M_Quantity, M_Cost },
            { where: { Medicine_ID: req.params.id } }
        );
        if (updated[0] === 0) {
            res.status(404).json({ error: 'Medicine not found or not updated' });
            return;
        }
        res.json({ success: true, message: 'Medicine updated successfully' });
    } catch (error) {
        console.error('Error updating medicine:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const DeleteMedicine = async (req, res) => {
    try {
        const deleted = await Medicine.destroy({
            where: { Medicine_ID: req.params.id },
        });
        if (deleted === 0) {
            res.status(404).json({ error: 'Medicine not found' });
            return;
        }
        res.json({ success: true, message: 'Medicine deleted successfully' });
    } catch (error) {
        console.error('Error deleting medicine:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    FindAllMedicine,
    FindSingleMedicine,
    AddMedicine,
    UpdateMedicine,
    DeleteMedicine,
};
