import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Box, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';
import { useNavigate, useLocation } from 'react-router-dom';

function CreateEmergencyContact({ onClose }) {
    const [formData, setFormData] = useState({
        Contact_Name: '',
        Phone: '',
        Relation: '',
        Patient_ID: '',
    });
    const [patients, setPatients] = useState([]);
    const [emergencyContacts, setEmergencyContacts] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const token = Cookies.get('token'); 
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchPatients();
        const patientId = location.state?.patientId;
        if (patientId) {
            setFormData((prevState) => ({ ...prevState, Patient_ID: patientId }));
        }
    }, [location.state]);

    const fetchPatients = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/patient', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    useEffect(() => {
        fetchEmergencyContacts();
    }, []);

    const fetchEmergencyContacts = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/emergency_contact', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setEmergencyContacts(response.data);
        } catch (error) {
            console.error('Error fetching emergency contacts:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddEmergencyContact = async () => {
        try {
            await axios.post('http://localhost:9004/api/emergency_contact/create', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/dashboard/emergency_contact');
            window.location.reload();
        } catch (error) {
            console.error('Error adding emergency contact:', error);
            showAlert('Error adding emergency contact. Please try again.');
        }
    };

    const handleValidation = async () => {
        const { Contact_Name, Phone, Relation, Patient_ID } = formData;
        const phoneRegex = /^(?:\+\d{1,3}\s?)?\d{3}(?:\d{6,7})$/;

        if (Contact_Name === '' || Phone === '' || Relation === '' || Patient_ID === '') {
            showAlert('All fields are required.');
            return;
        }
        if (Contact_Name.length < 2) {
            showAlert('Name cannot be less than 2 characters long!');
            return;
        }
        if (Phone.length !== 9) {
            showAlert('Phone should be 9 characters long!');
            return;
        }
        if (!phoneRegex.test(Phone)) {
            showAlert('Please enter a valid phone number (e.g., 044111222).');
            return;
        }
        if (Patient_ID < 1) {
            showAlert('Patient ID should be at least 1');
            return;
        }

        const existingEmergencyContact = Array.isArray(emergencyContacts) ? emergencyContacts.find(contact => contact.Phone === Phone) : null;
        if (existingEmergencyContact) {
            showAlert('Phone number already exists');
            return;
        }

        try {
            await axios.get(`http://localhost:9004/api/patient/check/${Patient_ID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            handleAddEmergencyContact();
        } catch (error) {
            console.error('Error checking patient ID:', error);
            showAlert('Patient ID does not exist');
        }
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    return (
        <Modal open onClose={onClose} className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 400, mx: 'auto' }}>
                {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}
                <Typography variant="h6" component="h1" gutterBottom>Add Emergency Contact</Typography>
                <TextField
                    fullWidth
                    label="Contact Name"
                    variant="outlined"
                    margin="normal"
                    name="Contact_Name"
                    value={formData.Contact_Name}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    label="Phone"
                    variant="outlined"
                    margin="normal"
                    name="Phone"
                    value={formData.Phone}
                    onChange={handleChange}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel id="relation-label">Relation</InputLabel>
                    <Select
                        labelId="relation-label"
                        id="Relation"
                        name="Relation"
                        value={formData.Relation}
                        label="Relation"
                        onChange={handleChange}
                    >
                        <MenuItem value=""><em>Select Relation</em></MenuItem>
                        <MenuItem value="Mother">Mother</MenuItem>
                        <MenuItem value="Father">Father</MenuItem>
                        <MenuItem value="Sister">Sister</MenuItem>
                        <MenuItem value="Brother">Brother</MenuItem>
                        <MenuItem value="Close family Member">Close Family Member</MenuItem>
                        <MenuItem value="Friend">Friend</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="patient-select-label">Patient</InputLabel>
                    <Select
                        labelId="patient-select-label"
                        id="Patient_ID"
                        name="Patient_ID"
                        value={formData.Patient_ID}
                        label="Patient"
                        onChange={handleChange}
                    >
                        <MenuItem value=""><em>Select Patient</em></MenuItem>
                        {patients.map(patient => (
                            <MenuItem key={patient.Patient_ID} value={patient.Patient_ID}>
                                {`${patient.Patient_Fname} ${patient.Patient_Lname}`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleValidation} sx={{ mr: 1 }}>Submit</Button>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default CreateEmergencyContact;
