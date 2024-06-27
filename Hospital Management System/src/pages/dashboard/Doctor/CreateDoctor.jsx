import React, { useState, useEffect, lazy, Suspense } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl, Modal } from '@mui/material';
import Cookies from 'js-cookie';

// Lazy load the ErrorModal component
const ErrorModal = lazy(() => import('../../../components/ErrorModal'));

function CreateDoctor({ onClose }) {
    const [formData, setFormData] = useState({
        Qualifications: '',
        Emp_ID: '',
        Specialization: '',
    });
    const [doctors, setDoctors] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/staff/doctors', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddDoctors = async () => {
        try {
            await axios.post("http://localhost:9004/api/doctors/create", formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/dashboard/doctor');
            window.location.reload();
        } catch (error) {
            console.error('Error adding doctors', error);
            showAlert('Error adding doctors. Please try again.');
        }
    };

    const handleValidation = async () => {
        const { Qualifications, Emp_ID, Specialization } = formData;

        if (Qualifications === '' || Emp_ID === '' || Specialization === '') {
            showAlert('All fields are required!');
            return;
        }

        if (parseInt(Emp_ID) < 1) {
            showAlert('Employee ID cannot be less than 1');
            return;
        }

        try {
            await handleAddDoctors();
        } catch (error) {
            console.error('Error adding doctor:', error);
            showAlert('Error adding doctor. Please try again.');
        }
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
        setTimeout(() => {
            setShowErrorModal(false);
        }, 3000);
    };

    return (
        <Modal open onClose={onClose} className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 400, mx: 'auto' }}>
                <Suspense fallback={<div>Loading...</div>}>
                    {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}
                </Suspense>
                <Typography variant="h6" component="h1" gutterBottom>Add Doctor</Typography>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Qualifications"
                    variant="outlined"
                    id="Qualifications"
                    name="Qualifications"
                    placeholder="Enter Qualifications"
                    value={formData.Qualifications}
                    onChange={handleChange}
                />
                <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel id="doctor-select-label">Doctor</InputLabel>
                    <Select
                        labelId="doctor-select-label"
                        id="visitDoctorID"
                        name="Emp_ID"
                        value={formData.Emp_ID}
                        onChange={handleChange}
                        label="Doctor"
                    >
                        <MenuItem value=""><em>Select Doctor</em></MenuItem>
                        {doctors.map(doctor => (
                            <MenuItem key={doctor.Emp_ID} value={doctor.Emp_ID}>
                                {`${doctor.Emp_Fname} ${doctor.Emp_Lname}`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Specialization"
                    variant="outlined"
                    id="Specialization"
                    name="Specialization"
                    placeholder="Enter Specialization"
                    value={formData.Specialization}
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

export default CreateDoctor;
