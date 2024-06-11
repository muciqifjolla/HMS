import React, { useState, useEffect, lazy, Suspense } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl, Modal } from '@mui/material';
import Cookies from 'js-cookie';

// Lazy load the ErrorModal component
const ErrorModal = lazy(() => import('../../../components/ErrorModal'));

function UpdateDoctor({ id, onClose }) {
    const [formData, setFormData] = useState({
        Qualifications: '',
        Emp_ID: '',
        Specialization: ''
    });
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/doctors/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = response.data;
                setOriginalData(data);
                setFormData({
                    Qualifications: data.Qualifications,
                    Emp_ID: data.Emp_ID,
                    Specialization: data.Specialization
                });
            } catch (error) {
                console.error('Error fetching doctor:', error);
                setAlertMessage('Error fetching doctor details.');
                setShowErrorModal(true);
            }
        };

        fetchData();
    }, [id, token]);

    useEffect(() => {
        const fetchAllDoctors = async () => {
            try {
                const response = await axios.get('http://localhost:9004/api/doctors', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setDoctors(response.data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };

        fetchAllDoctors();
    }, [token]);

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleUpdateDoctor = async () => {
        const { Qualifications, Emp_ID, Specialization } = formData;

        if (!Qualifications.trim() ||  Emp_ID === '' || !Specialization.trim()) {
            showAlert("All fields are required.");
            return;
        }

        if (
            Qualifications === originalData.Qualifications &&
            Emp_ID === originalData.Emp_ID &&
            Specialization === originalData.Specialization
        ) {
            showAlert("Data must be changed before updating.");
            return;
        }

        try {
            await axios.put(`http://localhost:9004/api/doctors/update/${id}`, {
                Qualifications,
                Emp_ID,
                Specialization
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Close the modal after updating
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error updating doctor:', error);
            showAlert('Error updating doctor.');
        }
    };

   return (
        <Modal open onClose={onClose} className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 400, mx: 'auto' }}>
            <Suspense fallback={<div>Loading...</div>}>
                    {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}
                </Suspense>
                <Typography variant="h6" component="h1" gutterBottom>Update Doctor</Typography>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Qualifications"
                    variant="outlined"
                    id="Qualifications"
                    name="Qualifications"
                    placeholder="Enter Qualifications"
                    value={formData.Qualifications}
                    onChange={handleInputChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Employee ID"
                    variant="outlined"
                    id="Emp_ID"
                    name="Emp_ID"
                    placeholder="Enter Employee ID"
                    value={formData.Emp_ID}
                    onChange={handleInputChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Specialization"
                    variant="outlined"
                    id="Specialization"
                    name="Specialization"
                    placeholder="Enter Specialization"
                    value={formData.Specialization}
                    onChange={handleInputChange}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleUpdateDoctor} sx={{ mr: 1 }}>Submit</Button>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default UpdateDoctor;
