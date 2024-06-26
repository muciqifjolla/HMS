const Bill = require('../models/Bill');
const Medicine = require('../models/Medicine');
const Room = require('../models/Room');
const Patient = require('../models/Patient');

const FindAllBills = async (req, res) => {
    try {
        const bills = await Bill.findAll({
            include: [
                {
                    model: Patient,
                    attributes: ['Patient_Fname', 'Patient_Lname']
                }
            ]
        });
        res.json(bills);
    } catch (error) {
        console.error('Error fetching all bills:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const FindSingleBill = async (req, res) => {
    try {
        const bill = await Bill.findByPk(req.params.id, {
            include: [Patient]
        });
        if (!bill) {
            res.status(404).json({ error: 'Bill not found' });
            return;
        }
        res.json(bill);
    } catch (error) {
        console.error('Error fetching single bill:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const AddBill = async (req, res) => {
    try {
        const {
            Patient_ID,
            Date_Issued,
            Description,
            Amount,
            Payment_Status
        } = req.body;

        // Validations
        if (!Date_Issued || !Amount || !Patient_ID) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newBill = await Bill.create({
            Patient_ID,
            Date_Issued,
            Description,
            Amount,
            Payment_Status
        });
        res.json({ success: true, message: 'Bill added successfully', data: newBill });
    } catch (error) {
        console.error('Error adding bill:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const UpdateBill = async (req, res) => {
    try {
        const {
            Date_Issued,
            Description,
            Amount,
            Payment_Status
        } = req.body;

        // Validations
        if (!Date_Issued || !Amount) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const updated = await Bill.update(
            {
                Date_Issued,
                Description,
                Amount,
                Payment_Status
            },
            { where: { Bill_ID: req.params.id } }
        );
        if (updated[0] === 0) {
            res.status(404).json({ error: 'Bill not found or not updated' });
            return;
        }
        res.json({ success: true, message: 'Bill updated successfully' });
    } catch (error) {
        console.error('Error updating bill:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const DeleteBill = async (req, res) => {
    try {
        const deleted = await Bill.destroy({
            where: { Bill_ID: req.params.id },
        });
        if (deleted === 0) {
            res.status(404).json({ error: 'Bill not found' });
            return;
        }
        res.json({ success: true, message: 'Bill deleted successfully' });
    } catch (error) {
        console.error('Error deleting bill:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    FindAllBills,
    FindSingleBill,
    AddBill,
    UpdateBill,
    DeleteBill,
};
