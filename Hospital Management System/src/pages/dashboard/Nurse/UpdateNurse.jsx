import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Box, Button, Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';

function UpdateNurse({ id, onClose }) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Emp_ID: '',
    });
    const [patients, setPatients] = useState([]);
    const [nurses, setNurses] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [nurseRes, patientsRes, nursesRes] = await Promise.all([
                    axios.get(`http://localhost:9004/api/nurse/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:9004/api/patient', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:9004/api/staff/nurses', { headers: { 'Authorization': `Bearer ${token}` } }),
                ]);

                const nurseData = nurseRes.data;
                setOriginalData(nurseData);
                setFormData({
                    Patient_ID: nurseData.Patient_ID,
                    Emp_ID: nurseData.Emp_ID,
                });
                setPatients(patientsRes.data);
                setNurses(nursesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setAlertMessage('Error fetching nurse details.');
                setShowErrorModal(true);
            }
        };

        fetchData();
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleUpdateNurse = async () => {
        if (formData.Patient_ID === '' || formData.Emp_ID === '') {
            showAlert('All fields are required');
            return;
        }

        if (formData.Patient_ID < 1) {
            showAlert('Patient ID cannot be less than 1');
            return;
        }
        if (formData.Emp_ID < 1) {
            showAlert('Employee ID cannot be less than 1');
            return;
        }

        if (
            formData.Patient_ID === originalData.Patient_ID &&
            formData.Emp_ID === originalData.Emp_ID
        ) {
            showAlert('No changes detected');
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
                <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel id="patient-select-label">Patient</InputLabel>
                    <Select
                        labelId="patient-select-label"
                        id="Patient_ID"
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
                    <InputLabel id="emp-select-label">Employee</InputLabel>
                    <Select
                        labelId="emp-select-label"
                        id="Emp_ID"
                        name="Emp_ID"
                        value={formData.Emp_ID}
                        onChange={handleChange}
                        label="Employee"
                    >
                        <MenuItem value=""><em>Select Employee</em></MenuItem>
                        {nurses.map(nurse => (
                            <MenuItem key={nurse.Emp_ID} value={nurse.Emp_ID}>
                                {`${nurse.Emp_Fname} ${nurse.Emp_Lname}`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleUpdateNurse} sx={{ mr: 1 }}>Submit</Button>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default UpdateNurse;
