import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Modal, MenuItem } from '@mui/material';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function UpdateEmergency_Contact({ id, onClose }) {
    const [formData, setFormData] = useState({
        Contact_Name: '',
        Phone: '',
        Relation: '',
        Patient_ID: '',
    });
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const [patients, setPatients] = useState([]);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/emergency_contact/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = response.data;
                setOriginalData(data);
                setFormData({
                    Contact_Name: data.Contact_Name,
                    Phone: data.Phone,
                    Relation: data.Relation,
                    Patient_ID: data.Patient_ID,
                });
            } catch (error) {
                console.error('Error fetching emergency contact:', error);
                showAlert('Error fetching emergency contact details.');
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

    const handleUpdateContact = async () => {
        const phoneRegex = /^(?:\+\d{1,2}\s?)?(?:\d{3})(?:\d{6})$/;

        if (!formData.Contact_Name.trim()) {
            showAlert("Name cannot be empty.");
            return;
        }

        if (!formData.Phone.trim() || !formData.Phone.match(phoneRegex) || formData.Phone.length !== 9) {
            showAlert("Phone should be 9 characters long!");
            return;
        }

        if (!formData.Relation.trim()) {
            showAlert("Relation cannot be empty.");
            return;
        }

        if (!formData.Patient_ID || formData.Patient_ID < 1) {
            showAlert("Invalid Patient ID.");
            return;
        }

        if (
            formData.Contact_Name === originalData.Contact_Name &&
            formData.Phone === originalData.Phone &&
            formData.Relation === originalData.Relation &&
            formData.Patient_ID === originalData.Patient_ID
        ) {
            showAlert("Data must be changed before updating.");
            return;
        }

        try {
            await axios.put(`http://localhost:9004/api/emergency_contact/update/${id}`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            navigate('/dashboard/emergency_contact');
            window.location.reload();
        } catch (error) {
            console.error('Error updating emergency contact:', error);
            showAlert('Error updating emergency contact.');
        }
    };

    return (
        <Modal open onClose={onClose} className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 400, mx: 'auto' }}>
                {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}
                <Typography variant="h6" component="h1" gutterBottom>Update Emergency Contact</Typography>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Name"
                    variant="outlined"
                    id="Contact_Name"
                    name="Contact_Name"
                    value={formData.Contact_Name}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Phone"
                    variant="outlined"
                    id="Phone"
                    name="Phone"
                    value={formData.Phone}
                    onChange={handleChange}
                    disabled
                />
                <TextField
                    margin="normal"
                    fullWidth
                    select
                    label="Relation"
                    variant="outlined"
                    id="Relation"
                    name="Relation"
                    value={formData.Relation}
                    onChange={handleChange}
                >
                    <MenuItem value=''>Select Relation</MenuItem>
                    <MenuItem value='Mother'>Mother</MenuItem>
                    <MenuItem value='Father'>Father</MenuItem>
                    <MenuItem value='Sister'>Sister</MenuItem>
                    <MenuItem value='Brother'>Brother</MenuItem>
                    <MenuItem value='Close family Member'>Close Family Member</MenuItem>
                    <MenuItem value='Friend'>Friend</MenuItem>
                </TextField>
                <TextField
                    margin="normal"
                    fullWidth
                    select
                    label="Patient"
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
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleUpdateContact} sx={{ mr: 1 }}>Submit</Button>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default UpdateEmergency_Contact;
