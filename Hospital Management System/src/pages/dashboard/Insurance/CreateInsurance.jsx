import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Box, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
function CreateInsurance({onClose}) {
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
    const [patients, setPatients] = useState([]);
    const [insurance, setInsurance] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get('token'); 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

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
        // Fetch existing medicines when component mounts
        fetchInurance();
    }, []);

    const fetchInurance = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/insurance',{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            setInsurance(response.data);
        } catch (error) {
            console.error('Error fetching insurance:', error);
        }
    };

    const handleAddInsurance = async () => {
        try {
            await axios.post("http://localhost:9004/api/insurance/create", formData,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            navigate('/dashboard/insurance');
            window.location.reload(); // Refresh after successful addition
        } catch (error) {
            console.error('Error adding insurance:', error);
            showAlert('Error adding insurance. Please try again.');
        }
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
        // Automatically hide the error modal after 3 seconds
    };

    const handleValidation = async () => {
        const {
            Patient_ID,
            Ins_Code,
            End_Date,
            Provider,
            Plan,
            Co_Pay,
            Coverage,
            Maternity,
            Dental,
            Optical,
        } = formData;
    
        if (Patient_ID === '' || Ins_Code === '' || End_Date === '' || Provider === '' || Plan === '' || Co_Pay === '' || Coverage === '' || Maternity === '' || Dental === '' || Optical === '') {
            showAlert('All fields are required!');
            return;
        }
        if (Ins_Code.length < 6) {
            showAlert("Insurance Code must be at least 6 characters.");
            return;
        }
        if (Patient_ID < 1) {
            showAlert('Patient ID can not be less than 1');
            return;
        }
    
        const existingInsurance = insurance.find(insurance => insurance.Ins_Code === Ins_Code);
        if (existingInsurance) {
            showAlert('Insurance with the same code already exists');
            return;
        }
        try {
            await axios.get(`http://localhost:9004/api/patient/check/${Patient_ID}`,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            handleAddInsurance();
        } catch (error) {
            console.error('Error checking patient ID:', error);
            showAlert('Patient ID does not exist');
        }
       
    };
    

    return (
<Modal open onClose={onClose} className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
    <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 400, mx: 'auto' }}>
        {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}
        <Typography variant="h6" component="h1" gutterBottom>Add Insurance</Typography>
        <FormControl fullWidth margin="normal">
            <InputLabel id="patient-select-label">Patient</InputLabel>
            <Select
                labelId="patient-select-label"
                id="Patient_ID"
                name="Patient_ID"
                value={formData.Patient_ID}
                label="Patient"
                onChange={handleChange}
            >
                <MenuItem value=""><em>Select Patient</em></MenuItem>
                {patients.map((patient) => (
                    <MenuItem key={patient.Patient_ID} value={patient.Patient_ID}>
                        {`${patient.Patient_Fname} ${patient.Patient_Lname}`}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
        <TextField
            fullWidth
            label="Insurance Code"
            variant="outlined"
            margin="normal"
            name="Ins_Code"
            value={formData.Ins_Code}
            onChange={handleChange}
        />
        <TextField
            fullWidth
            type="date"
            label="End Date"
            variant="outlined"
            margin="normal"
            name="End_Date"
            value={formData.End_Date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
        />
        {["Provider", "Plan", "Co_Pay", "Maternity", "Dental", "Optical"].map(field => (
            <FormControl fullWidth margin="normal" key={field}>
                <InputLabel id={`${field}-label`}>{field}</InputLabel>
                <Select
                    labelId={`${field}-label`}
                    id={field}
                    name={field}
                    value={formData[field]}
                    label={field}
                    onChange={handleChange}
                >
                    <MenuItem value=""><em>None</em></MenuItem>
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                </Select>
            </FormControl>
        ))}
        <FormControl fullWidth margin="normal">
            <InputLabel id="coverage-label">Coverage</InputLabel>
            <Select
                labelId="coverage-label"
                id="Coverage"
                name="Coverage"
                value={formData.Coverage}
                label="Coverage"
                onChange={handleChange}
            >
                <MenuItem value=""><em>Select Coverage</em></MenuItem>
                <MenuItem value="25%">25%</MenuItem>
                <MenuItem value="50%">50%</MenuItem>
                <MenuItem value="75%">75%</MenuItem>
                <MenuItem value="100%">100%</MenuItem>
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

export default CreateInsurance;
