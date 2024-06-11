import React, { useState, useEffect, lazy, Suspense } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl, Modal } from '@mui/material';
import Cookies from 'js-cookie'; // Import js-cookie


// Lazy load the ErrorModal component
const ErrorModal = lazy(() => import('../../../components/ErrorModal'));

function CreateDoctor({ onClose })  {
    const [formData, setFormData] = useState({
        Qualifications: '',
        Emp_ID: '',
        Specialization: ''
        
    });
    const [doctor, setDoctor] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get('token'); 

 
    // useEffect(() => {
        
    //     fetchStaff();
        
    // }, []);

    const fetchDoctors = async () => {
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
    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };


    const handleAddDoctor = async () => {
        try {
            await axios.post("http://localhost:9004/api/doctors/create", formData,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
                });
            navigate('/dashboard/doctor');
            window.location.reload(); // Refresh after successful addition
        } catch (error) {
            console.error('Error adding doctor:', error);
            
        }
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
        
        
    };

    const handleValidation = async () => {
        const { Qualifications, Emp_ID, Specialization } = formData;

        if (Qualifications === '' || Emp_ID === '' || Specialization === '' ) {
            showAlert('All fields are required!');
            return;
        }

        if (Emp_ID < 1) {
            showAlert('Employee ID can not be less than 1');
            return;
        }
    
        const existingDoctor = doctor.find(doctor => doctor.Emp_ID === Emp_ID);
        if (existingDoctor) {
            showAlert('Doctor with the same Emp_ID already exists');
            return;
        }
        // try {
        //     await axios.get(`http://localhost:9004/api/staff/check/${Emp_ID}`);
            
        //     handleAddDoctor();
        // } catch (error) {
        //     console.error('Error checking Emp ID:', error);
        //     showAlert('Emp ID does not exist');
        // }
        handleAddDoctor();
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
                <TextField
                    fullWidth
                    margin="normal"
                    label="Employee ID"
                    variant="outlined"
                    id="Emp_ID"
                    name="Emp_ID"
                    placeholder="Enter Employee ID"
                    value={formData.Emp_ID}
                    onChange={handleChange}
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
