import axios from 'axios';
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl, Modal } from '@mui/material';
import Cookies from 'js-cookie';

const ErrorModal = lazy(() => import('../../../components/ErrorModal'));

function CreateVisit({ onClose }) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Doctor_ID: '',
        date_of_visit: '',
        condition: '',
        diagnosis: '',
        therapy: '',
    });
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        fetchPatients();
        fetchDoctors();
    }, []);

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

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/doctor', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleAddVisit = async () => {
        try {
            await axios.post('http://localhost:9004/api/visit/create', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            navigate('/dashboard/visit');
            window.location.reload();
        } catch (error) {
            console.error('Error adding visit:', error);
            setAlertMessage('Error adding visit. Please try again.');
            setShowErrorModal(true);
        }
    };

    const handleValidation = async () => {
        const { Patient_ID, Doctor_ID, date_of_visit, condition, diagnosis, therapy } = formData;

        if (Patient_ID === '' || Doctor_ID === '' || date_of_visit === '' || condition === '' || diagnosis === '' || therapy === '') {
            showAlert('All fields are required');
            return;
        }
        if (parseInt(Patient_ID) < 1 || parseInt(Doctor_ID) < 1) {
            showAlert('Patient ID and Doctor ID cannot be less than 1');
            return;
        }

        handleAddVisit();
    };

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
                <Typography variant="h6" component="h1" gutterBottom>Add Visit</Typography>
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
                <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel id="doctor-select-label">Doctor</InputLabel>
                    <Select
                        labelId="doctor-select-label"
                        id="visitDoctorID"
                        name="Doctor_ID"
                        value={formData.Doctor_ID}
                        onChange={handleChange}
                        label="Doctor"
                    >
                        <MenuItem value=""><em>Select Doctor</em></MenuItem>
                        {doctors.map(doctor => (
                            <MenuItem key={doctor.Doctor_ID} value={doctor.Doctor_ID}>
                                {`${doctor.Staff.Emp_Fname} ${doctor.Staff.Emp_Lname}`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Date of Visit"
                    variant="outlined"
                    type="date"
                    id="dateOfVisit"
                    name="date_of_visit"
                    value={formData.date_of_visit}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Condition"
                    variant="outlined"
                    id="condition"
                    name="condition"
                    placeholder="Enter Condition"
                    value={formData.condition}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Diagnosis"
                    variant="outlined"
                    id="diagnosis"
                    name="diagnosis"
                    placeholder="Enter Diagnosis"
                    value={formData.diagnosis}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Therapy"
                    variant="outlined"
                    id="therapy"
                    name="therapy"
                    placeholder="Enter Therapy"
                    value={formData.therapy}
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

export default CreateVisit;
