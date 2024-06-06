import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Select, MenuItem, InputLabel, FormControl, Modal } from '@mui/material';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';

function CreateNurse({ onClose }) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Emp_ID: '',
    });

    const [patients, setPatients] = useState([]);
    const [staffs, setStaffs] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        fetchPatients();
        fetchStaffs();
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

    const fetchStaffs = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/staff', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setStaffs(response.data);
        } catch (error) {
            console.error('Error fetching staffs:', error);
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
            window.location.reload();
        } catch (error) {
            console.error('Error adding nurse:', error);
            showAlert(error.response?.data?.message || 'Error adding nurse. Please try again.');
        }
    };

    const handleValidation = async () => {
        const { Patient_ID, Emp_ID } = formData;

        if (Patient_ID === '' || Emp_ID === '') {
            showAlert('All fields are required');
            return;
        }

        if (Patient_ID < 1 || Emp_ID < 1) {
            showAlert('ID cannot be less than 1');
            return;
        }

        

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
                <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel id="patient-select-label">Patient</InputLabel>
                    <Select
                        labelId="patient-select-label"
                        id="nursePatientID"
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
                    <InputLabel id="staff-select-label">Employee</InputLabel>
                    <Select
                        labelId="staff-select-label"
                        id="nurseStaffID"
                        name="Emp_ID"
                        value={formData.Emp_ID}
                        onChange={handleChange}
                        label="Employee"
                    >
                        <MenuItem value=""><em>Select Employee</em></MenuItem>
                        {staffs.map(staff => (
                            <MenuItem key={staff.Emp_ID} value={staff.Emp_ID}>
                                {`${staff.Emp_Fname} ${staff.Emp_Lname}`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleValidation} sx={{ mr: 1 }}>Submit</Button>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default CreateNurse;
