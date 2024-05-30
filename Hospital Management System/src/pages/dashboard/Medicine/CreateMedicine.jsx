import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Box, TextField, Button, Typography, InputAdornment } from '@mui/material';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';
function CreateMedicine({ onClose }) {
    const [formData, setFormData] = useState({
        M_name: '',
        M_Quantity: '',
        M_Cost: '',
    });

    const [medicines, setMedicines] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        // Fetch existing medicines when component mounts
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/medicine',{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setMedicines(response.data);
        } catch (error) {
            console.error('Error fetching medicines:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddMedicine = async () => {
        try {
            await axios.post('http://localhost:9004/api/medicine/create', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            )

            navigate('/dashboard/medicines');
            window.location.reload(); // Refresh the page after successful submission
        } catch (error) {
            console.error('Error adding medicine:', error);
            showAlert('Error adding medicine. Please try again.');
        }
    };

    const handleValidation = () => {
        const { M_name, M_Quantity, M_Cost } = formData;

        // Ensure all required fields are filled
        if (!M_name.trim() || M_Quantity === '' || M_Cost === '') {
            showAlert('All fields are required');
            return;
        }
        if (M_name.length < 2) {
            showAlert('Name can not be less than 1');
            return;
        }
        if (M_Quantity < 1) {
            showAlert('Quantity can not be less than 1');
            return;
        }
        if (M_Cost < 1) {
            showAlert('Cost can not be less than 1');
            return;
        }

        // Check if medicine with the same name already exists
        const existingMedicine = medicines.find(medicine => medicine.M_name === M_name);
        if (existingMedicine) {
            showAlert('Medicine with the same name already exists');
            return;
        }

        // Proceed with form submission after successful validation
        handleAddMedicine();
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
        // Automatically hide the error modal after 3 seconds
        // setTimeout(() => {
        //     setAlertMessage('');
        //     setShowErrorModal(false);
        // }, 3000);
    };

    return (
        <Modal open onClose={onClose} className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 400, mx: 'auto' }}>
                {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}
                <Typography variant="h6" component="h1" gutterBottom>Add Medicine</Typography>
                <Box mb={2}>
                    <TextField
                        fullWidth
                        label="Medicine Name"
                        variant="outlined"
                        id="M_name"
                        name="M_name"
                        type="text"
                        value={formData.M_name}
                        onChange={handleChange}
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        fullWidth
                        label="Quantity"
                        variant="outlined"
                        id="M_Quantity"
                        name="M_Quantity"
                        type="number"
                        value={formData.M_Quantity}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">Units</InputAdornment>,
                        }}
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        fullWidth
                        label="Cost"
                        variant="outlined"
                        id="M_Cost"
                        name="M_Cost"
                        type="number"
                        value={formData.M_Cost}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleValidation} sx={{ mr: 1 }}>Submit</Button>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default CreateMedicine;
