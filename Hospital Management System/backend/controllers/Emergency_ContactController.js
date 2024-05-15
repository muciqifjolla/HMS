// backend/controllers/MedicineController.js
const Emergency_Contact = require('../models/Emergency_Contact');

const FindAllEmergency_Contact = async (req, res) => {
    try {
        const emergency_contact = await Emergency_Contact.findAll();
        res.json(emergency_contact);
    } catch (error) {
        console.error('Error fetching all emergency contact:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const FindSingleEmergency_Contact = async (req, res) => {
    try {
        const emergency_contact = await Emergency_Contact.findByPk(req.params.id);
        if (!emergency_contact) {
            res.status(404).json({ error: 'Emergency Contact not found' });
            return;
        }
        res.json(emergency_contact);
    } catch (error) {
        console.error('Error fetching single medicine:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const AddEmergency_Contact = async (req, res) => {
    try {
        const { Contact_Name, Phone, Relation, Patient_ID } = req.body;

        // Validation
        if (!Contact_Name || Contact_Name.length < 2) {
            return res.status(400).json({ error: 'Contact_Name must be at least 2 characters long' });
        }
        if (!Phone || Phone.length !== 9) {
            return res.status(400).json({ error: 'Phone must be exactly 9 characters long' });
        }
        if (!Relation) {
            return res.status(400).json({ error: 'Relation cannot be empty' });
        }
        if (!Patient_ID) {
            return res.status(400).json({ error: 'Patient_ID cannot be empty' });
        }

        const newEmergency_Contact = await Emergency_Contact.create({
            Contact_Name,
            Phone,
            Relation,
            Patient_ID
        });
        res.json({ success: true, message: 'Emergency Contact added successfully', data: newEmergency_Contact });
    } catch (error) {
        console.error('Error adding emergency contact:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const UpdateEmergency_Contact = async (req, res) => {
    try {
        const { Contact_Name, Phone, Relation, Patient_ID } = req.body;

        // Validation
        if (!Contact_Name || Contact_Name.length < 2) {
            return res.status(400).json({ error: 'Contact_Name must be at least 2 characters long' });
        }
        if (!Phone || Phone.length !== 9) {
            return res.status(400).json({ error: 'Phone must be exactly 9 characters long' });
        }
        if (!Relation) {
            return res.status(400).json({ error: 'Relation cannot be empty' });
        }
        if (!Patient_ID) {
            return res.status(400).json({ error: 'Patient_ID cannot be empty' });
        }

        const updated = await Emergency_Contact.update(
            { Contact_Name, Phone, Relation, Patient_ID },
            { where: { Contact_ID: req.params.id } }
        );
        if (updated[0] === 0) {
            res.status(404).json({ error: 'Emergency Contact not found or not updated' });
            return;
        }
        res.json({ success: true, message: 'Emergency_Contact updated successfully' });
    } catch (error) {
        console.error('Error updating emergency contact:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const DeleteEmergency_Contact = async (req, res) => {
    try {
        const deleted = await Emergency_Contact.destroy({
            where: { Contact_ID: req.params.id },
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

module.exports = {
    FindAllEmergency_Contact,
    FindSingleEmergency_Contact,
    AddEmergency_Contact,
    UpdateEmergency_Contact,
    DeleteEmergency_Contact,
};
