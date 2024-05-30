import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl, Modal } from '@mui/material';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';

function UpdateVisit({ id, onClose }) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Doctor_ID: '',
        date_of_visit: '',
        condition: '',
        diagnosis: '',
        therapy: '',
    });
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/visit/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const visitData = response.data;
                setOriginalData(visitData);
                setFormData({
                    Patient_ID: visitData.Patient_ID,
                    Doctor_ID: visitData.Doctor_ID,
                    date_of_visit: visitData.date_of_visit,
                    condition: visitData.condition,
                    diagnosis: visitData.diagnosis,
                    therapy: visitData.therapy,
                });
            } catch (error) {
                const message = error.response?.status === 401
                    ? 'Invalid or expired authentication token. Please log in again.'
                    : 'Error fetching visit details.';
                setAlertMessage(message);
                setShowErrorModal(true);
            }
        };

        fetchData();
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleUpdateVisit = async () => {
        const { Patient_ID, Doctor_ID, date_of_visit, condition, diagnosis, therapy } = formData;

        if (Patient_ID === '' || Doctor_ID === '' || date_of_visit === '' || condition === '' || diagnosis === '' || therapy === '') {
            showAlert('All fields are required');
            return;
        }

        if (
            parseInt(Patient_ID) === parseInt(originalData.Patient_ID) &&
            parseInt(Doctor_ID) === parseInt(originalData.Doctor_ID) &&
            date_of_visit === originalData.date_of_visit &&
            condition === originalData.condition &&
            diagnosis === originalData.diagnosis &&
            therapy === originalData.therapy
        ) {
            showAlert("Data must be changed before updating.");
            return;
        }

        if (parseInt(Patient_ID) < 1 || parseInt(Doctor_ID) < 1) {
            showAlert("Patient ID and Doctor ID must be at least 1.");
            return;
        }

        try {
            await axios.put(`http://localhost:9004/api/visit/update/${id}`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            navigate('/dashboard/visit');
            window.location.reload();
        } catch (error) {
            console.error('Error updating visit:', error);
            setAlertMessage('Error updating visit.');
            setShowErrorModal(true);
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
                <Typography variant="h6" component="h1" gutterBottom>Update Visit</Typography>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Patient ID"
                    variant="outlined"
                    id="Patient_ID"
                    name="Patient_ID"
                    value={formData.Patient_ID}
                    onChange={handleChange}
                    disabled
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Doctor ID"
                    variant="outlined"
                    id="Doctor_ID"
                    name="Doctor_ID"
                    value={formData.Doctor_ID}
                    onChange={handleChange}
                    disabled
                />
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
                    <Button variant="contained" color="primary" onClick={handleUpdateVisit} sx={{ mr: 1 }}>Submit</Button>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default UpdateVisit;
