import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Modal, InputAdornment, MenuItem } from '@mui/material';
import ErrorModal from '../../../components/ErrorModal'; // Assuming this component exists for handling error messages
import Cookies from 'js-cookie';
function UpdateInsurance({ id, onClose }) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Ins_Code: '',
        End_Date: '',
        Provider: '',
        Plan: '',
        Co_Pay: '',
        Coverage: '',
        Maternity: '',
        Dental: '',
        Optical: '',
    });
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const [patients, setPatients] = useState([]);
    const token = Cookies.get('token');

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/insurance/${id}`,{
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = response.data;
                setOriginalData(data);
                setFormData({
                    Patient_ID: data.Patient_ID,
                    Ins_Code: data.Ins_Code,
                    End_Date: data.End_Date,
                    Provider: data.Provider,
                    Plan: data.Plan,
                    Co_Pay: data.Co_Pay,
                    Coverage: data.Coverage,
                    Maternity: data.Maternity,
                    Dental: data.Dental,
                    Optical: data.Optical,
                });
            } catch (error) {
                console.error('Error fetching insurance:', error);
                showAlert('Error fetching insurance details.');
            }
        };

        fetchData();
    }, [id, token]);

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleUpdateInsurance = async () => {
        const numberRegex = /^\d+$/;

        if (!formData.Patient_ID || formData.Patient_ID < 1) {
            showAlert("Patient ID must be a positive number.");
            return;
        }

        if (!formData.Ins_Code) {
            showAlert("Insurance Code must be a positive number.");
            return;
        }

        if (formData.Ins_Code.length < 6) {
            showAlert("Insurance Code must be at least 6 characters.");
            return;
        }
        if (!formData.End_Date) {
            showAlert("End Date is required.");
            return;
        }

        if (!formData.Provider.trim()) {
            showAlert("Provider cannot be empty.");
            return;
        }

        if (!formData.Plan.trim()) {
            showAlert("Plan cannot be empty.");
            return;
        }

        if (!formData.Co_Pay.trim()) {
            showAlert("Co-Pay cannot be empty.");
            return;
        }

        if (!formData.Coverage.trim()) {
            showAlert("Coverage cannot be empty.");
            return;
        }
        if (!formData.Maternity.trim()) {
            showAlert("Maternity cannot be empty.");
            return;
        }

        if (!formData.Dental.trim()) {
            showAlert("Dental cannot be empty.");
            return;
        }

        if (!formData.Optical.trim()) {
            showAlert("Optical cannot be empty.");
            return;
        }

        if (
            formData.Patient_ID === originalData.Patient_ID &&
            formData.Ins_Code === originalData.Ins_Code &&
            formData.End_Date === originalData.End_Date &&
            formData.Provider === originalData.Provider &&
            formData.Plan === originalData.Plan &&
            formData.Co_Pay === originalData.Co_Pay &&
            formData.Coverage === originalData.Coverage &&
            formData.Maternity === originalData.Maternity &&
            formData.Dental === originalData.Dental &&
            formData.Optical === originalData.Optical
        ) {
            showAlert("Data must be changed before updating.");
            return;
        }

        try {
            await axios.put(`http://localhost:9004/api/insurance/update/${id}`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error updating insurance:', error);
            showAlert('Error updating insurance.');
        }
    };

    return (
        <Modal open onClose={onClose} className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 400, mx: 'auto' }}>
                {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}
                <Typography variant="h6" component="h1" gutterBottom>Update Insurance</Typography>
                <TextField
                    margin="normal"
                    fullWidth
                    select
                    label="Patient ID"
                    variant="outlined"
                    id="Patient_ID"
                    name="Patient_ID"
                    value={formData.Patient_ID}
                    onChange={handleChange}
                    disabled
                >
                    <MenuItem value=''>Select Patient</MenuItem>
                    {patients.map(patient => (
                        <MenuItem key={patient.Patient_ID} value={patient.Patient_ID}>
                            {`${patient.Patient_Fname} ${patient.Patient_Lname}`}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Insurance Code"
                    variant="outlined"
                    id="Ins_Code"
                    name="Ins_Code"
                    value={formData.Ins_Code}
                    onChange={handleChange}
                    disabled
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="End Date"
                    type="date"
                    variant="outlined"
                    id="End_Date"
                    name="End_Date"
                    value={formData.End_Date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    select
                    label="Provider"
                    variant="outlined"
                    id="Provider"
                    name="Provider"
                    value={formData.Provider}
                    onChange={handleChange}
                >
                    <MenuItem value=''>Select Yes/No</MenuItem>
                    <MenuItem value='No'>No</MenuItem>
                    <MenuItem value='Yes'>Yes</MenuItem>
                </TextField>
                <TextField
                    margin="normal"
                    fullWidth
                    select
                    label="Plan"
                    variant="outlined"
                    id="Plan"
                    name="Plan"
                    value={formData.Plan}
                    onChange={handleChange}
                >
                    <MenuItem value=''>Select Yes/No</MenuItem>
                    <MenuItem value='No'>No</MenuItem>
                    <MenuItem value='Yes'>Yes</MenuItem>
                </TextField>
                <TextField
                    margin="normal"
                    fullWidth
                    select
                    label="Co-Pay"
                    variant="outlined"
                    id="Co_Pay"
                    name="Co_Pay"
                    value={formData.Co_Pay}
                    onChange={handleChange}
                >
                    <MenuItem value=''>Select Yes/No</MenuItem>
                    <MenuItem value='No'>No</MenuItem>
                    <MenuItem value='Yes'>Yes</MenuItem>
                </TextField>
                <TextField
                    margin="normal"
                    fullWidth
                    select
                    label="Coverage"
                    variant="outlined"
                    id="Coverage"
                    name="Coverage"
                    value={formData.Coverage}
                    onChange={handleChange}
                >
                    <MenuItem value=''>Select Coverage</MenuItem>
                    <MenuItem value='25%'>25%</MenuItem>
                    <MenuItem value='50%'>50%</MenuItem>
                    <MenuItem value='75%'>75%</MenuItem>
                    <MenuItem value='100%'>100%</MenuItem>
                </TextField>
                <TextField
                    margin="normal"
                    fullWidth
                    select
                    label="Maternity"
                    variant="outlined"
                    id="Maternity"
                    name="Maternity"
                    value={formData.Maternity}
                    onChange={handleChange}
                >
                    <MenuItem value=''>Select Yes/No</MenuItem>
                    <MenuItem value='No'>No</MenuItem>
                    <MenuItem value='Yes'>Yes</MenuItem>
                </TextField>
                <TextField
                    margin="normal"
                    fullWidth
                    select
                    label="Dental"
                    variant="outlined"
                    id="Dental"
                    name="Dental"
                    value={formData.Dental}
                    onChange={handleChange}
                >
                    <MenuItem value=''>Select Yes/No</MenuItem>
                    <MenuItem value='No'>No</MenuItem>
                    <MenuItem value='Yes'>Yes</MenuItem>
                </TextField>
                <TextField
                    margin="normal"
                    fullWidth
                    select
                    label="Optical"
                    variant="outlined"
                    id="Optical"
                    name="Optical"
                    value={formData.Optical}
                    onChange={handleChange}
                >
                    <MenuItem value=''>Select Yes/No</MenuItem>
                    <MenuItem value='No'>No</MenuItem>
                    <MenuItem value='Yes'>Yes</MenuItem>
                </TextField>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleUpdateInsurance} sx={{ mr: 1 }}>Submit</Button>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default UpdateInsurance;
