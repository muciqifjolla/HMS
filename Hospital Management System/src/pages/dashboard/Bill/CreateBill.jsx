import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';
import { Box, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl, Modal } from '@mui/material';
import Cookies from 'js-cookie';

function CreateBill({ onClose }) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Date_Issued: '',
        Description: '',
        Amount: '',
        Payment_Status: '',
    });
    const [patients, setPatients] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const token = Cookies.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPatients();
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddBill = async () => {
        try {
            await axios.post('http://localhost:9004/api/bills/create', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/dashboard/bills');
            window.location.reload(); // Refresh after successful addition
        } catch (error) {
            console.error('Error adding Bill:', error);
            showAlert(error.response?.data?.message || 'Error adding bill. Please try again.');
        }
    };

    const handleValidation = async () => {
        const { Patient_ID, Date_Issued, Description, Amount, Payment_Status } = formData;

        if (Patient_ID === '' || Date_Issued === '' || Description === '' || Amount === '' || Payment_Status === '') {
            showAlert('All fields are required');
            return;
        }

        if (parseInt(Patient_ID) < 1) {
            showAlert('Patient ID cannot be less than 1');
            return;
        }

        try {
            await axios.get(`http://localhost:9004/api/patient/check/${Patient_ID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            handleAddBill();
        } catch (error) {
            console.error('Error checking patient ID:', error);
            showAlert('Patient ID does not exist');
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
                    <Typography variant="h6" component="h1" gutterBottom>Add Bill</Typography>
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
      {/* Date Issued */}
      <TextField
                    fullWidth
                    margin="normal"
                    label="Date Issued"
                    variant="outlined"
                    type="date"
                    id="Date_Issued"
                    name="Date_Issued"
                    value={formData.Date_Issued}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                />
            {/* Description */}
            <TextField
                    fullWidth
                    margin="normal"
                    label="Description"
                    variant="outlined"
                    id="Description"
                    name="Description"
                    placeholder="Enter Description"
                    value={formData.Description}
                    onChange={handleChange}
                />
               
                {/* Amount */}
                <TextField
                    fullWidth
                    margin="Amount"
                    label="Amount"
                    variant="outlined"
                    type="number"
                    id="Amount"
                    name="Amount"
                    value={formData.Amount}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                />
                
                {/* Payment Status */}
                <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel id="blood-type-select-label">Payment Status</InputLabel>
                    <Select
                        labelId="payment-status-select-label"
                        id="Payment_Status"
                        name="Payment_Status"
                        value={formData.Payment_Status}
                        onChange={handleChange}
                        label="Payment Status"
                    >
                        <MenuItem value=""><em>Select Payment Status</em></MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Paid">Paid</MenuItem>
                        <MenuItem value="Failed">Failed</MenuItem>
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
export default CreateBill;
