import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ErrorModal from '../../../components/ErrorModal';
import { Box, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl, Modal } from '@mui/material';
import Cookies from 'js-cookie';

function UpdateMedicalHistory({ id, onClose }) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Allergies: '',
        Pre_Conditions: '',
    });
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const [patients, setPatients] = useState([]);
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/medicalhistory/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = response.data;
                setFormData(data);
                setOriginalData(data);
            } catch (error) {
                console.error('Error fetching medical history:', error);
                showAlert('Error fetching medical history details.');
            }
        };

        fetchData();
    }, [id, token]);

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

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleValidation= async () => {
        try {
            const { Allergies, Pre_Conditions } = formData;

            if (!Allergies.trim() || !Pre_Conditions.trim()) {
                showAlert('All fields are required.');
                return;
            }

            if (
                Allergies === originalData.Allergies &&
                Pre_Conditions === originalData.Pre_Conditions
            ) {
                showAlert("Data must be changed before updating.");
                return;
            }

            await axios.put(`http://localhost:9004/api/medicalhistory/update/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            onClose(); // Close the modal after updating
            window.location.reload(); // Reload the page
        } catch (error) {
            console.error('Error updating medical history:', error);
            showAlert('Error updating medical history.');
        }
    };

    const closeErrorModal = () => {
        setShowErrorModal(false);
    };

    return(
        <Modal open onClose={onClose} className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 400, mx: 'auto' }}>
                {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}
                <Typography variant="h6" component="h1" gutterBottom>Update Medical History</Typography>
                <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel id="patient-select-label">Patient</InputLabel>
                    <Select
                        labelId="patient-select-label"
                        id="visitPatientID"
                        name="Patient_ID"
                        value={formData.Patient_ID}
                        onChange={handleChange}
                        label="Patient"
                        disabled
                    >
                        <MenuItem value=""><em>Select Patient</em></MenuItem>
                        {patients.map(patient => (
                            <MenuItem key={patient.Patient_ID} value={patient.Patient_ID}>
                                {`${patient.Patient_Fname} ${patient.Patient_Lname}`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
         {/* Allergies */}
         <TextField
                fullWidth
                margin="normal"
                label="Allergies"
                variant="outlined"
                id="allergies"
                name="Allergies"
                placeholder="Enter Allergies"
                value={formData.Allergies}
                onChange={handleChange}
            />
            
            {/* Pre Conditions */}
            <TextField
                fullWidth
                margin="normal"
                label="Pre_Conditions"
                variant="outlined"
                id="Pre_Conditions"
                name="Pre_Conditions"
                placeholder="Enter Diagnosis"
                value={formData.Pre_Conditions}
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

export default UpdateMedicalHistory;
