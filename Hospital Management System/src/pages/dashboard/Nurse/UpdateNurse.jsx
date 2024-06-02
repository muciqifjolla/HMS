import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';

function UpdateNurse({ id, onClose }) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Emp_ID: '',
    });
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/nurse/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = response.data;
                setOriginalData(data);
                setFormData({
                    Patient_ID: data.Patient_ID,
                    Emp_ID: data.Emp_ID,
                });
            } catch (error) {
                console.error('Error fetching nurse:', error);
                setAlertMessage('Error fetching nurse details.');
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleUpdateNurse = async () => {
        // Basic validation
        if (formData.Patient_ID === '' || formData.Emp_ID === '') {
            showAlert('All fields are required');
            return;
        }

        if (parseInt(formData.Patient_ID) < 1 || parseFloat(formData.Patient_ID) < 1) {
            showAlert('Patient_ID and cost must be at least 1.');
            return;
        }
        if (parseInt(formData.Emp_ID) < 1 || parseFloat(formData.Emp_ID) < 1) {
            showAlert('Emp_ID and cost must be at least 1.');
            return;
        }
        // Check if any data has been changed
        if (
            formData.Patient_ID === originalData.Patient_ID.toString() &&
            formData.Emp_ID === originalData.Emp_ID.toString()
        ) {
            showAlert('Data must be changed before updating.');
            return;
        }

        try {
            await axios.get(`http://localhost:9004/api/patient/check/${formData.Patient_ID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error checking patient ID:', error);
            showAlert('Patient ID does not exist');
            return;
        }

        try {
            await axios.get(`http://localhost:9004/api/staff/check/${formData.Emp_ID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error checking Employee ID:', error);
            showAlert('Employee ID does not exist');
            return;
        }

        try {
            await axios.put(`http://localhost:9004/api/nurse/update/${id}`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            window.location.reload(); // Refresh the page to show the updated data
        } catch (error) {
            console.error('Error updating nurse:', error);
            showAlert('Error updating nurse. Please try again.');
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
                <Typography variant="h6" component="h1" gutterBottom>Update Nurse</Typography>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Patient ID"
                    variant="outlined"
                    id="Patient_ID"
                    name="Patient_ID"
                    type="number"
                    value={formData.Patient_ID}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Employee ID"
                    variant="outlined"
                    id="Emp_ID"
                    name="Emp_ID"
                    type="number"
                    value={formData.Emp_ID}
                    onChange={handleChange}
                    
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleUpdateNurse} sx={{ mr: 1 }}>Submit</Button>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default UpdateNurse;
