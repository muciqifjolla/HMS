const Bill = require('../models/Bill');
const Medicine = require('../models/Medicine');
const Room = require('../models/Room');
const Patient = require('../models/Patient');

const getPatientByEmail = async (email) => {
    try {
        const patient = await Patient.findOne({
            where: { Email: email }
        });

        if (!patient) {
            throw new Error('Patient not found');
        }

        return patient;
    } catch (error) {
        console.error('Error fetching patient by email:', error);
        throw error;
    }
};

const FindAllBills = async (req, res) => {
    try {
        const userEmail = req.user.email;
        const userRole = req.user.role;

        let bills;
        if (userRole === 'admin') {
            bills = await Bill.findAll({
                include: [
                    {
                        model: Patient,
                        attributes: ['Patient_Fname', 'Patient_Lname']
                    }
                ]
            });
        } else if (userRole === 'patient') {
            const patient = await getPatientByEmail(userEmail);
            bills = await Bill.findAll({
                where: { Patient_ID: patient.Patient_ID },
                include: [
                    {
                        model: Patient,
                        attributes: ['Patient_Fname', 'Patient_Lname']
                    }
                ]
            });
        } else {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const billsDataWithNames = bills.map(bill => ({
            ...bill.toJSON(),
            Patient_Name: bill.Patient ? `${bill.Patient.Patient_Fname} ${bill.Patient.Patient_Lname}` : 'Unknown Patient'
        }));

        res.json({ bills: billsDataWithNames });
    } catch (error) {
        console.error('Error fetching bills:', error);
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
