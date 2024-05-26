const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Staff = require('../models/Staff');
const Patient = require('../models/Patient');

const FindAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            include: [{
                model: Doctor,
                include: [{
                    model: Staff,
                    attributes: ['Emp_Fname', 'Emp_Lname'] // Include only the full_name attribute
                }]
            }, {
                model: Patient
            }]
        });
        console.log(appointments);
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching all appointments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const FindSingleAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id);
        if (!appointment) {
            res.status(404).json({ error: 'Appointment not found' });
            return;
        }
        res.json(appointment);
    } catch (error) {
        console.error('Error fetching single appointment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const AddAppointment = async (req, res) => {
    try {
        const { Scheduled_On, Date, Time, Doctor_ID, Patient_ID } = req.body;

        if (!Scheduled_On || !Date || !Time || !Doctor_ID || !Patient_ID) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newAppointment = await Appointment.create({
            Scheduled_On,
            Date,
            Time,
            Doctor_ID,
            Patient_ID,
        });
        res.status(201).json({ success: true, message: 'Appointment added successfully', data: newAppointment });
    } catch (error) {
        console.error('Error adding appointment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const UpdateAppointment = async (req, res) => {
    try {
        const { Scheduled_On, Date, Time, Doctor_ID, Patient_ID } = req.body;

        if (!Scheduled_On || !Date || !Time || !Doctor_ID || !Patient_ID) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const [updatedCount] = await Appointment.update(
            { Scheduled_On, Date, Time, Doctor_ID, Patient_ID },
            { where: { Appoint_ID: req.params.id } }
        );
        if (updatedCount === 0) {
            res.status(404).json({ error: 'Appointment not found or not updated' });
            return;
        }
        res.json({ success: true, message: 'Appointment updated successfully' });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const DeleteAppointment = async (req, res) => {
    try {
        const deletedCount = await Appointment.destroy({
            where: { Appoint_ID: req.params.id },
        });
        if (deletedCount === 0) {
            res.status(404).json({ error: 'Appointment not found' });
            return;
        }
        res.json({ success: true, message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    FindAllAppointments,
    FindSingleAppointment,
    AddAppointment,
    UpdateAppointment,
    DeleteAppointment,
};
