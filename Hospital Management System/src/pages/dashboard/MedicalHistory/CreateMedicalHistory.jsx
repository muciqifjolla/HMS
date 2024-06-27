import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl, Modal } from '@mui/material';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';

function CreateMedicalHistory({ onClose }) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Allergies: '',
        Pre_Conditions: '',
    });
    const [patients, setPatients] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const token = Cookies.get('token');
    const navigate = useNavigate();

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
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddMedicalHistory = async () => {
        try {
            await axios.post('http://localhost:9004/api/medicalhistory/create', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/dashboard/medicalhistorys');
            window.location.reload(); // Refresh after successful addition
        } catch (error) {
            console.error('Error adding MedicalHistory:', error);
            showAlert(error.response?.data?.message || 'Error adding medical history. Please try again.');
        }
    };

    const handleValidation = async () => {
        const { Patient_ID, Allergies, Pre_Conditions } = formData;

        if (Patient_ID === '' || Allergies === '' || Pre_Conditions === '') {
            showAlert('All fields are required');
            return;
        }

        if (parseInt(Patient_ID) < 1) {
            showAlert('Patient ID cannot be less than 1');
            return;
        }

        try {
            await axios.get(`http://localhost:9004/api/patient/check/${Patient_ID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            handleAddMedicalHistory();
        } catch (error) {
            console.error('Error checking patient ID:', error);
            showAlert('Patient ID does not exist');
        }
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    return(
            <Modal open onClose={onClose} className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
                <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 400, mx: 'auto' }}>
                    {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}
                    <Typography variant="h6" component="h1" gutterBottom>Add Medical History</Typography>
                    <FormControl fullWidth variant="outlined" margin="normal">
                        <InputLabel id="patient-select-label">Patient</InputLabel>
                        <Select
                            labelId="patient-select-label"
                            id="visitPatientID"
                            name="Patient_ID"
                            value={formData.Patient_ID}
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

export default CreateMedicalHistory;
