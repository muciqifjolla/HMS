import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ErrorModal from '../../../components/ErrorModal';
import { Box, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl, Modal } from '@mui/material';

import Cookies from 'js-cookie';

function UpdateBill({ id, onClose }) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Amount: '',
        Payment_Status: '',
        Description: '',
        Date_Issued: ''
    });
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const [patients, setPatients] = useState([]);
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/bills/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = response.data;
                setFormData(data);
                setOriginalData(data);
            } catch (error) {
                console.error('Error fetching bill:', error);
                showAlert('Error fetching bill details.');
            }
        };

        fetchData();
    }, [id, token]);

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

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleValidation = async () => {
        try {
            const { Amount, Payment_Status, Description, Date_Issued } = formData;

            if (!Amount.trim() || !Payment_Status.trim() || !Description.trim() || !Date_Issued.trim()) {
                showAlert('All fields are required.');
                return;
            }

            if (
                Amount === originalData.Amount &&
                Payment_Status === originalData.Payment_Status &&
                Description === originalData.Description &&
                Date_Issued === originalData.Date_Issued
            ) {
                showAlert("Data must be changed before updating.");
                return;
            }

            await axios.put(`http://localhost:9004/api/bills/update/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error updating bill:', error);
            showAlert('Error updating bill.');
        }
    };

    const closeErrorModal = () => {
        setShowErrorModal(false);
    };

    return (
        <Modal open onClose={onClose} className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 400, mx: 'auto' }}>
                {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}
                <Typography variant="h6" component="h1" gutterBottom>Update BIll</Typography>
                <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel id="patient-select-label">Patient</InputLabel>
                    <Select
                        labelId="patient-select-label"
                        id="visitPatientID"
                        name="Patient_ID"
                        value={formData.Patient_ID}
                        onChange={handleChange}
                        label="Patient"
                        disabled
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
export default UpdateBill;
