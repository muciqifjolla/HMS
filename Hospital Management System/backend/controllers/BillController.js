const Bill = require('../models/Bill');
const Medicine = require('../models/Medicine');
const Room = require('../models/Room');
const Patient = require('../models/Patient');

const FindAllBills = async (req, res) => {
    try {
        const bills = await Bill.findAll({
            include: [{
                model: Room,
            }, {
                model: Patient
            },
            {
                model: Medicine
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
                include: [Room, Patient, Medicine]
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
                Room_ID,
                Medicine_ID,
                DATE,
                Other_charges,
            } = req.body;
    
            // Validations
            if (!DATE || !Other_charges || !Patient_ID || !Room_ID || !Medicine_ID) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            if (Other_charges < 0 || Patient_ID < 0 || Room_ID < 0 || Medicine_ID < 0) {
                return res.status(400).json({ error: 'Numeric fields must be non-negative' });
            }
    
            // Retrieve room cost
            // Retrieve room cost
            const room = await Room.findByPk(Room_ID);
            const medicine = await Medicine.findByPk(Medicine_ID);
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }
            if (!medicine) {
                return res.status(404).json({ error: 'Room not found' });
            }
            
            const roomCost = parseFloat(room.Room_cost);
            const medicineCost = parseFloat(medicine.M_Cost);
            const otherCharges = parseFloat(Other_charges);
    
            // Calculate total
            const total = roomCost + medicineCost + otherCharges;
    
            // Create new bill
            const newBill = await Bill.create({
                Patient_ID,
                Room_ID,
                Medicine_ID,
                DATE,
                Other_charges,
                Total: total,
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
            Patient_ID,
            Room_ID,
            Medicine_ID,
            DATE,
            Other_charges,
            Total,
        } = req.body;

        // Validations
        if (!DATE || !Other_charges  || !Total || !Patient_ID || !Room_ID || !Medicine_ID) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (Other_charges < 0 || Total < 0 || Patient_ID < 0 || Room_ID < 0 || Medicine_ID < 0) {
            return res.status(400).json({ error: 'Numeric fields must be non-negative' });
        }

         // Retrieve room cost
            // Retrieve room cost
            const room = await Room.findByPk(Room_ID);
            const medicine = await Medicine.findByPk(Medicine_ID);
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }
            if (!medicine) {
                return res.status(404).json({ error: 'Room not found' });
            }

        const roomCost = parseFloat(room.Room_cost);
        const medicineCost = parseFloat(medicine.M_Cost);
        const otherCharges = parseFloat(Other_charges);

        // Calculate total
        const total = roomCost + medicineCost + otherCharges;


        const updated = await Bill.update(
            {
                Patient_ID,
                Room_ID,
                Medicine_ID,
                DATE,
                Other_charges,
                Total: total,
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
