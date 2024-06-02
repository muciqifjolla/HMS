import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';

function CreateNurse({ onClose }) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Emp_ID: '',
    });

    const [nurses, setNurses] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        // Fetch existing nurses when component mounts
        fetchNurses();
    }, []);

    const fetchNurses = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/nurse',{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setNurses(response.data);
        } catch (error) {
            console.error('Error fetching nurses:', error);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddNurse = async () => {
        try {
            await axios.post('http://localhost:9004/api/nurse/create', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/dashboard/nurse');
            window.location.reload(); // Refresh the page after successful submission
        } catch (error) {
            console.error('Error adding nurse:', error);
            showAlert('Error adding nurse. Please try again.');
        }
    };

    const handleValidation = async () => {
        const { Patient_ID, Emp_ID } = formData;
        // Ensure all required fields are filled
        if ( Patient_ID === '' || Emp_ID === '') {
            showAlert('All fields are required');
            return;
        }
        if (Patient_ID < 1) {
            showAlert('Patient ID can not be less than 1');
            return;
        }
        if (Emp_ID < 1) {
            showAlert('Emp ID can not be less than 1');
            return;
        }
        // Check if patient exists
        try {
            await axios.get(`http://localhost:9004/api/patient/check/${Patient_ID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error checking patient ID:', error);
            showAlert('Patient ID does not exist');
            return;
        }

        // Check if employee exists
        try {
            await axios.get(`http://localhost:9004/api/staff/check/${Emp_ID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error checking employee ID:', error);
            showAlert('Employee ID does not exist');
            return;
        }
        
        // Proceed with form submission after successful validation
        handleAddNurse();
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    return (
        <Modal open onClose={onClose} className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 400, mx: 'auto' }}>
                {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}
                <Typography variant="h6" component="h1" gutterBottom>Add Nurse</Typography>
                <Box mb={2}>
                    <TextField
                        fullWidth
                        label="Patient ID"
                        variant="outlined"
                        id="Patient_ID"
                        name="Patient_ID"
                        type="number"
                        value={formData.Patient_ID}
                        onChange={handleChange}
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        fullWidth
                        label="Employee ID"
                        variant="outlined"
                        id="Emp_ID"
                        name="Emp_ID"
                        type="number"
                        value={formData.Emp_ID}
                        onChange={handleChange}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleValidation} sx={{ mr: 1 }}>Submit</Button>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default CreateNurse;

