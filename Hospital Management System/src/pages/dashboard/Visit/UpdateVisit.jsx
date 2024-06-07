import axios from 'axios';
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Modal } from '@mui/material';
import Cookies from 'js-cookie';

const ErrorModal = lazy(() => import('../../../components/ErrorModal'));

function UpdateVisit({ id, onClose }) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Doctor_ID: '',
        date_of_visit: '',
        condition: '',
        diagnosis: '',
        therapy: '',
    });
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [patientName, setPatientName] = useState('');
    const [doctorName, setDoctorName] = useState('');
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [visitRes, patientRes, doctorRes] = await Promise.all([
                    axios.get(`http://localhost:9004/api/visit/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:9004/api/patient', { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get('http://localhost:9004/api/doctor', { headers: { 'Authorization': `Bearer ${token}` } })
                ]);
                const visitData = visitRes.data;
                const patient = patientRes.data.find(p => p.Patient_ID === visitData.Patient_ID);
                const doctor = doctorRes.data.find(d => d.Doctor_ID === visitData.Doctor_ID);
                
                setFormData({
                    Patient_ID: visitData.Patient_ID,
                    Doctor_ID: visitData.Doctor_ID,
                    date_of_visit: visitData.date_of_visit,
                    condition: visitData.condition,
                    diagnosis: visitData.diagnosis,
                    therapy: visitData.therapy,
                });
                setPatientName(patient ? `${patient.Patient_Fname} ${patient.Patient_Lname}` : 'Unknown');
                setDoctorName(doctor ? `${doctor.Staff.Emp_Fname} ${doctor.Staff.Emp_Lname}` : 'Unknown');
            } catch (error) {
                const message = error.response?.status === 401
                    ? 'Invalid or expired authentication token. Please log in again.'
                    : 'Error fetching visit details.';
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

    const handleUpdateVisit = async () => {
        const { Patient_ID, Doctor_ID, date_of_visit, condition, diagnosis, therapy } = formData;

        if (Patient_ID === '' || Doctor_ID === '' || date_of_visit === '' || condition === '' || diagnosis === '' || therapy === '') {
            showAlert('All fields are required');
            return;
        }

        try {
            await axios.put(`http://localhost:9004/api/visit/update/${id}`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            navigate('/dashboard/visit');
            window.location.reload();
        } catch (error) {
            console.error('Error updating visit:', error);
            setAlertMessage('Error updating visit.');
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
                {showErrorModal && (
                    <Suspense fallback={<div>Loading...</div>}>
                        <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
                    </Suspense>
                )}
                <Typography variant="h6" component="h1" gutterBottom>Update Visit</Typography>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Patient Name"
                    variant="outlined"
                    value={patientName}
                    disabled
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Doctor Name"
                    variant="outlined"
                    value={doctorName}
                    disabled
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Date of Visit"
                    variant="outlined"
                    type="date"
                    id="dateOfVisit"
                    name="date_of_visit"
                    value={formData.date_of_visit}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Condition"
                    variant="outlined"
                    id="condition"
                    name="condition"
                    placeholder="Enter Condition"
                    value={formData.condition}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Diagnosis"
                    variant="outlined"
                    id="diagnosis"
                    name="diagnosis"
                    placeholder="Enter Diagnosis"
                    value={formData.diagnosis}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Therapy"
                    variant="outlined"
                    id="therapy"
                    name="therapy"
                    placeholder="Enter Therapy"
                    value={formData.therapy}
                    onChange={handleChange}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleUpdateVisit} sx={{ mr: 1 }}>Submit</Button>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default UpdateVisit;
