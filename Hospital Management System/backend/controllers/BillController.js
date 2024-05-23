const Bill = require('../models/Bill');

const FindAllBills = async (req, res) => {
    try {
        const bills = await Bill.findAll();
        res.json(bills);
    } catch (error) {
        console.error('Error fetching all bills:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const FindSingleBill = async (req, res) => {
    try {
        const bill = await Bill.findByPk(req.params.id);
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
            DATE,
            Room_cost,
            Other_charges,
            M_Cost,
            Total,
            Patient_ID,
            Room_ID,
            Medicine_ID
        } = req.body;

        // Validations
        if (!DATE || !Room_cost || !Other_charges || !M_Cost || !Total || !Patient_ID || !Room_ID || !Medicine_ID) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (Room_cost < 0 || Other_charges < 0 || M_Cost < 0 || Total < 0 || Patient_ID < 0 || Room_ID < 0 || Medicine_ID < 0) {
            return res.status(400).json({ error: 'Numeric fields must be non-negative' });
        }

        // Create new bill
        const newBill = await Bill.create({
            DATE,
            Room_cost,
            Other_charges,
            M_Cost,
            Total,
            Patient_ID,
            Room_ID,
            Medicine_ID
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
            DATE,
            Room_cost,
            Other_charges,
            M_Cost,
            Total,
            Patient_ID,
            Room_ID,
            Medicine_ID
        } = req.body;

        // Validations
        if (!DATE || !Room_cost || !Other_charges || !M_Cost || !Total || !Patient_ID || !Room_ID || !Medicine_ID) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (Room_cost < 0 || Other_charges < 0 || M_Cost < 0 || Total < 0 || Patient_ID < 0 || Room_ID < 0 || Medicine_ID < 0) {
            return res.status(400).json({ error: 'Numeric fields must be non-negative' });
        }

        const updated = await Bill.update(
            {
                DATE,
                Room_cost,
                Other_charges,
                M_Cost,
                Total,
                Patient_ID,
                Room_ID,
                Medicine_ID
            },
            { where: { Payment_ID: req.params.id } }
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
            where: { Payment_ID: req.params.id },
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
