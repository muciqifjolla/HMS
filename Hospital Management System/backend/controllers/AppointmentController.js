const Appointment = require('../models/Appointment');
const Staff = require('../models/Staff');
const Department = require('../models/Department');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// Utility function to validate email format
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const getDoctorByEmail = async (email) => {
    try {
        const doctor = await Doctor.findOne({
            include: [{ model: Staff, where: { Email: email, Emp_type: 'doctor' } }]
        });

        if (!doctor) {
            throw new Error('Doctor not found');
        }

        return doctor;
    } catch (error) {
        console.error('Error fetching doctor by email:', error);
        throw error;
    }
};

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

const FindAllAppointments = async (req, res) => {
    try {
        const userEmail = req.user.email;
        const userRole = req.user.role;

        let appointments;
        if (userRole === 'admin') {
            appointments = await Appointment.findAll({
                include: [
                    { model: Patient, attributes: ['Patient_Fname', 'Patient_Lname'] },
                    { 
                        model: Doctor, 
                        attributes: ['Doctor_ID'],
                        include: [{ model: Staff, attributes: ['Emp_Fname', 'Emp_Lname'] }]
                    }
                ]
            });
        } else if (userRole === 'doctor') {
            const doctor = await getDoctorByEmail(userEmail);
            appointments = await Appointment.findAll({
                where: { Doctor_ID: doctor.Doctor_ID },
                include: [
                    { model: Patient, attributes: ['Patient_Fname', 'Patient_Lname'] },
                    { 
                        model: Doctor, 
                        attributes: ['Doctor_ID'],
                        include: [{ model: Staff, attributes: ['Emp_Fname', 'Emp_Lname'] }]
                    }
                ]
            });
        } else if (userRole === 'patient') {
            const patient = await getPatientByEmail(userEmail);
            appointments = await Appointment.findAll({
                where: { Patient_ID: patient.Patient_ID },
                include: [
                    { model: Patient, attributes: ['Patient_Fname', 'Patient_Lname'] },
                    { 
                        model: Doctor, 
                        attributes: ['Doctor_ID'],
                        include: [{ model: Staff, attributes: ['Emp_Fname', 'Emp_Lname'] }]
                    }
                ]
            });
        } else {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const appointmentsDataWithNames = appointments.map(appointment => ({
            ...appointment.toJSON(),
            Patient_Name: appointment.Patient ? `${appointment.Patient.Patient_Fname} ${appointment.Patient.Patient_Lname}` : 'Unknown Patient',
            Doctor_Name: appointment.Doctor && appointment.Doctor.Staff ? `${appointment.Doctor.Staff.Emp_Fname} ${appointment.Doctor.Staff.Emp_Lname}` : 'Unknown Doctor'
        }));

        return res.json({ appointments: appointmentsDataWithNames });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

const FindSingleAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id, {
            include: [
                { model: Patient, attributes: ['Patient_Fname', 'Patient_Lname'] },
                { 
                    model: Doctor, 
                    attributes: ['Doctor_ID'],
                    include: [{ model: Staff, attributes: ['Emp_Fname', 'Emp_Lname'] }]
                }
            ]
        });
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.json(appointment);
    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const AddAppointment = async (req, res) => {
    try {
        const { Scheduled_On, Date, Time, Doctor_ID, Patient_ID } = req.body;

        const newAppointment = await Appointment.create({
            Scheduled_On,
            Date,
            Time,
            Doctor_ID,
            Patient_ID
        });
        res.json({ success: true, message: 'Appointment added successfully', data: newAppointment });
    } catch (error) {
        console.error('Error adding appointment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const UpdateAppointment = async (req, res) => {
    try {
        const { Scheduled_On, Date, Time, Doctor_ID, Patient_ID } = req.body;

        const updated = await Appointment.update(
            { Scheduled_On, Date, Time, Doctor_ID, Patient_ID },
            { where: { Appoint_ID: req.params.id } }
        );
        if (updated[0] === 0) {
            return res.status(404).json({ error: 'Appointment not found or not updated' });
        }
        res.json({ success: true, message: 'Appointment updated successfully' });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const DeleteAppointment = async (req, res) => {
    try {
        const deleted = await Appointment.destroy({
            where: { Appoint_ID: req.params.id }
        });
        if (deleted === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
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
    DeleteAppointment
};
