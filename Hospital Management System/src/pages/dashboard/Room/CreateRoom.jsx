import axios from 'axios';
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl, Modal, InputAdornment } from '@mui/material';
import Cookies from 'js-cookie';

const ErrorModal = lazy(() => import('../../../components/ErrorModal'));

function CreateRoom({ onClose }) {
    const [formData, setFormData] = useState({
        Room_type: '',
        Patient_ID: '',
        Room_cost: '',
    });
    const [patients, setPatients] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const token = Cookies.get('token');

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
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleAddRoom = async () => {
        try {
            await axios.post('http://localhost:9004/api/room/create', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            navigate('/dashboard/room');
            window.location.reload();
        } catch (error) {
            console.error('Error adding room:', error);
            setAlertMessage('Error adding room. Please try again.');
            setShowErrorModal(true);
        }
    };

    const handleValidation = async () => {
        const { Room_type, Patient_ID, Room_cost } = formData;

        if (Room_type === '' || Patient_ID === '' || Room_cost === '') {
            showAlert('All fields are required');
            return;
        }
        if (parseInt(Patient_ID) < 1) {
            showAlert('Patient ID cannot be less than 1');
            return;
        }
        if (!isValidDecimal(Room_cost)) {
            showAlert('Cost must be a valid decimal (10.2)');
            return;
        }

        try {
            await axios.get(`http://localhost:9004/api/patient/check/${Patient_ID}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Error checking patient ID:', error);
            showAlert('Patient ID does not exist');
            return;
        }

        handleAddRoom();
    };

    const isValidDecimal = (value) => /^\d{0,8}(\.\d{1,2})?$/.test(value);

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    return (
        <Modal open onClose={onClose} className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 400, mx: 'auto' }}>
                {showErrorModal && (
                    <Suspense fallback={<div>Loading...</div>}>
                        <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
                    </Suspense>
                )}
                <Typography variant="h6" component="h1" gutterBottom>Add Room</Typography>
                {['Room_type', 'Patient_ID', 'Room_cost'].map((field, idx) => (
                    <Box key={idx} mb={2}>
                        {field === 'Patient_ID' ? (
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="patient-select-label">Patient</InputLabel>
                                <Select
                                    labelId="patient-select-label"
                                    id={field}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                    label="Patient"
                                >
                                    <MenuItem value=""><em>Select Patient</em></MenuItem>
                                    {patients.map(patient => (
                                        <MenuItem key={patient.Patient_ID} value={patient.Patient_ID}>
                                            {`${patient.Patient_Fname} ${patient.Patient_Lname}`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        ) : (
                            <TextField
                                fullWidth
                                label={field.replace('_', ' ')}
                                variant="outlined"
                                id={field}
                                name={field}
                                type={field === 'Room_cost' ? 'number' : 'text'}
                                value={formData[field]}
                                onChange={handleChange}
                                InputProps={field === 'Room_cost' ? {
                                    startAdornment: <InputAdornment position="start">€</InputAdornment>,
                                } : null}
                            />
                        )}
                    </Box>
                ))}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleValidation} sx={{ mr: 1 }}>Submit</Button>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default CreateRoom;
