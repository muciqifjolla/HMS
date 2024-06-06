import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material';
import ErrorModal from '../../../components/ErrorModal';

function UpdateNurse({ id, onClose }) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Emp_ID: '',
    });
    const [initialData, setInitialData] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [patients, setPatients] = useState([]);
    const [staffs, setStaffs] = useState([]);
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [nurseRes, patientRes, staffRes] = await Promise.all([
                    axios.get(`http://localhost:9004/api/nurse/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:9004/api/patient', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:9004/api/staff', { headers: { 'Authorization': `Bearer ${token}` } })
                ]);

                const nurseData = nurseRes.data;
                setPatients(patientRes.data);
                setStaffs(staffRes.data);

                setFormData({
                    Patient_ID: nurseData.Patient_ID,
                    Emp_ID: nurseData.Emp_ID,
                });
                setInitialData({
                    Patient_ID: nurseData.Patient_ID,
                    Emp_ID: nurseData.Emp_ID,
                });
            } catch (error) {
                const message = error.response?.status === 401
                    ? 'Invalid or expired authentication token. Please log in again.'
                    : 'Error fetching nurse details.';
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

    const handleUpdateNurse = async () => {
        const { Patient_ID, Emp_ID } = formData;

        if (Patient_ID === '' || Emp_ID === '') {
            showAlert('All fields are required');
            return;
        }

        if (JSON.stringify(formData) === JSON.stringify(initialData)) {
            showAlert('Data must be changed before updating');
            return;
        }

        try {
            await axios.put(`http://localhost:9004/api/nurse/update/${id}`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            navigate('/dashboard/nurse');
            window.location.reload();
        } catch (error) {
            console.error('Error updating nurse:', error);
            setAlertMessage('Error updating nurse.');
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
                <Typography variant="h6" component="h1" gutterBottom>Update Nurse</Typography>
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
                    <InputLabel id="staff-select-label">Employee</InputLabel>
                    <Select
                        labelId="staff-select-label"
                        id="nurseEmpID"
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
                    <Button variant="contained" color="primary" onClick={handleUpdateNurse} sx={{ mr: 1 }}>Submit</Button>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default UpdateNurse;
