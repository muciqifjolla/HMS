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
    
    const [staff, setStaff] = useState([]);
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        fetchDoctorDetails();
        fetchStaff();
    }, [id]);


    const fetchDoctorDetails = async () => {
        try {
            
            const response = await axios.get(`http://localhost:9004/api/doctors/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = response.data;
            setFormData(data);
        } catch (error) {
            console.error('Error fetching doctor details:', error);
            showAlert('Error fetching doctor details.');
        }
    };
    
    const fetchStaff = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/staff', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setStaff(response.data);
        } catch (error) {
            console.error('Error fetching staff:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleValidation = async () => {
        const { Qualifications, Emp_ID, Specialization } = formData;

        if (Qualifications === '' || Emp_ID === '' || Specialization === '') {
            showAlert("All fields are required.");
            return;
        }
        try {
            await axios.put(`http://localhost:9004/api/doctors/update/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            onClose(); // Close the modal after updating
            window.location.reload(); // Reload the page
        } catch (error) {
            console.error('Error updating doctor:', error);
            showAlert('Error updating doctors.');
        }
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
                        {staff.map(staffMember => (
                            <MenuItem key={staffMember.Emp_ID} value={staffMember.Emp_ID}>
                                {`${staffMember.Emp_Fname} ${staffMember.Emp_Lname}`}
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

export default UpdateDoctor;