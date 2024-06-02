import React, { useState, useEffect, lazy, Suspense } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl, Modal } from '@mui/material';
import Cookies from 'js-cookie';

// Lazy load the ErrorModal component
const ErrorModal = lazy(() => import('../../../components/ErrorModal'));

function CreatePatient({ onClose }) {
    const [formData, setFormData] = useState({
        Personal_Number: '',
        Patient_Fname: '',
        Patient_Lname: '',
        Birth_Date: '',
        Blood_type: '',
        Email: '',
        Gender: '',
        Phone: ''
    });

    const [patients, setPatients] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        fetchPatients();
    }, []);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddPatient = async () => {
        try {
            await axios.post('http://localhost:9004/api/patient/create', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/dashboard/patient');
            window.location.reload();
        } catch (error) {
            console.error('Error adding Patient:', error.response ? error.response.data : error.message);
            setAlertMessage('Error adding patient. Please try again.');
            setShowErrorModal(true);
        }
    };

    const handleValidation = () => {
        const { Personal_Number, Patient_Fname, Patient_Lname, Birth_Date, Blood_type, Email, Gender, Phone } = formData;
        const personalNumberRegex = /^\d{10}$/;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^(?:\+\d{1,2}\s?)?(?:\d{3})(?:\d{6})$/;
        const bloodTypeRegex = /^(A|B|AB|O)[+-]$/;

        if (Personal_Number === '' || Patient_Fname === '' || Patient_Lname === '' || Birth_Date === '' || Blood_type === '' || Email === '' || Gender === '' || Phone === '') {
            showAlert('All fields are required.');
            return;
        }

        if (!Personal_Number.match(personalNumberRegex)) {
            showAlert('Please enter a valid personal number');
            return;
        }

        if (!Blood_type.match(bloodTypeRegex)) {
            showAlert('Please enter a valid blood type (e.g., A+, B-, AB+, O-).');
            return;
        }

        if (!Email.match(emailRegex)) {
            showAlert('Please enter a valid email address.');
            return;
        }

        if (!Phone.match(phoneRegex)) {
            showAlert('Please enter a valid phone number (like: 044111222)');
            return;
        }

        const existingPatient = patients.find(patient => patient.Patient_Fname === Patient_Fname);
        if (existingPatient) {
            showAlert('Patient with the same name already exists');
            return;
        }

        handleAddPatient();
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    return (
        <Modal open onClose={onClose} className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 400, mx: 'auto' }}>
                <Suspense fallback={<div>Loading...</div>}>
                    {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}
                </Suspense>
                <Typography variant="h6" component="h1" gutterBottom>Add Patient</Typography>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Personal Number"
                    variant="outlined"
                    id="Personal_Number"
                    name="Personal_Number"
                    placeholder="Enter Personal Number"
                    value={formData.Personal_Number}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="First Name"
                    variant="outlined"
                    id="Patient_Fname"
                    name="Patient_Fname"
                    placeholder="Enter Firstname"
                    value={formData.Patient_Fname}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Last Name"
                    variant="outlined"
                    id="Patient_Lname"
                    name="Patient_Lname"
                    placeholder="Enter Lastname"
                    value={formData.Patient_Lname}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Birth Date"
                    variant="outlined"
                    type="date"
                    id="Birth_Date"
                    name="Birth_Date"
                    value={formData.Birth_Date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                />
                <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel id="gender-select-label">Gender</InputLabel>
                    <Select
                        labelId="gender-select-label"
                        id="Gender"
                        name="Gender"
                        value={formData.Gender}
                        onChange={handleChange}
                        label="Gender"
                    >
                        <MenuItem value=""><em>Select Gender</em></MenuItem>
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                        <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel id="blood-type-select-label">Blood Type</InputLabel>
                    <Select
                        labelId="blood-type-select-label"
                        id="Blood_type"
                        name="Blood_type"
                        value={formData.Blood_type}
                        onChange={handleChange}
                        label="Blood Type"
                    >
                        <MenuItem value=""><em>Select Blood Type</em></MenuItem>
                        <MenuItem value="A+">A+</MenuItem>
                        <MenuItem value="A-">A-</MenuItem>
                        <MenuItem value="B+">B+</MenuItem>
                        <MenuItem value="B-">B-</MenuItem>
                        <MenuItem value="AB+">AB+</MenuItem>
                        <MenuItem value="AB-">AB-</MenuItem>
                        <MenuItem value="O+">O+</MenuItem>
                        <MenuItem value="O-">O-</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    variant="outlined"
                    id="Email"
                    name="Email"
                    placeholder="Enter email"
                    value={formData.Email}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Phone"
                    variant="outlined"
                    id="Phone"
                    name="Phone"
                    placeholder="Enter Phone"
                    value={formData.Phone}
                    onChange={handleChange}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleValidation} sx={{ mr: 1 }}>Submit</Button>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default CreatePatient;
