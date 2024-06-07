import axios from 'axios';
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Modal, InputAdornment } from '@mui/material';
import Cookies from 'js-cookie';

const ErrorModal = lazy(() => import('../../../components/ErrorModal'));

function UpdateRoom({ id, onClose }) {
    const [formData, setFormData] = useState({
        Room_type: '',
        Patient_ID: '',
        Room_cost: '',
    });
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/room/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const responseData = response.data;
                setOriginalData(responseData);
                setFormData({
                    Room_type: responseData.Room_type,
                    Patient_ID: responseData.Patient_ID,
                    Room_cost: responseData.Room_cost,
                });
            } catch (error) {
                const message = error.response?.status === 401
                    ? 'Invalid or expired authentication token. Please log in again.'
                    : 'Error fetching room details.';
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

    const handleUpdateRoom = async () => {
        const { Room_type, Patient_ID, Room_cost } = formData;

        if (Room_type === '' || Patient_ID === '' || Room_cost === '') {
            showAlert('All fields are required');
            return;
        }

        if (
            Room_type === originalData.Room_type &&
            parseInt(Patient_ID) === parseInt(originalData.Patient_ID) &&
            parseInt(Room_cost) === parseInt(originalData.Room_cost)
        ) {
            showAlert("Data must be changed before updating.");
            return;
        }

        if (parseInt(Patient_ID) < 1) {
            showAlert("Patient ID must be at least 1.");
            return;
        }

        if (!isValidDecimal(Room_cost)) {
            showAlert('Cost must be a valid decimal (10.2)');
            return;
        }

        try {
            await axios.get(`http://localhost:9004/api/patient/check/${Patient_ID}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            await axios.put(`http://localhost:9004/api/room/update/${id}`, formData, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            navigate('/dashboard/room');
            window.location.reload();
        } catch (error) {
            const message = error.response?.status === 401
                ? 'Invalid or expired authentication token. Please log in again.'
                : 'Error updating room.';
            setAlertMessage(message);
            setShowErrorModal(true);
        }
    };

    const isValidDecimal = (value) => /^\d{0,8}(\.\d{1,2})?$/.test(value);

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
                <Typography variant="h6" component="h1" gutterBottom>Update Room</Typography>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Room type"
                    variant="outlined"
                    id="Room_type"
                    name="Room_type"
                    value={formData.Room_type}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Patient ID"
                    variant="outlined"
                    id="Patient_ID"
                    name="Patient_ID"
                    value={formData.Patient_ID}
                    onChange={handleChange}
                    disabled
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Room cost"
                    variant="outlined"
                    id="Room_cost"
                    name="Room_cost"
                    value={formData.Room_cost}
                    onChange={handleChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">€</InputAdornment>,
                    }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleUpdateRoom} sx={{ mr: 1 }}>Submit</Button>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default UpdateRoom;
