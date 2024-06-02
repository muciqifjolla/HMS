import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Box, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function CreateRating({ onClose }) {
    const [formData, setFormData] = useState({
        Emp_ID: '',
        Rating: '',
        Comments: '',
        Date: new Date().toISOString().slice(0, 10), // Default to today's date
    });
    const [staff, setStaff] = useState([]);
    const [rating, setRatings] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get('token'); 

    useEffect(() => {
        fetchStaff();
        fetchRating();
    }, []);

    const fetchStaff = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/staff', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setStaff(response.data);
        } catch (error) {
            console.error('Error fetching staff:', error);
        }
    };

    const fetchRating = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/rating',{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setRatings(response.data);
        } catch (error) {
            console.error('Error fetching rating:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddRating = async () => {
        try {
            await axios.post('http://localhost:9004/api/rating/create', formData,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            navigate('/dashboard/rating');
            window.location.reload(); // Refresh the page after successful submission
        } catch (error) {
            console.error('Error adding rating:', error);
            showAlert('Error adding emergency contact. Please try again.');
        }
    };

    const handleValidation = async () => {
        const { Emp_ID, Rating, Comments, Date } = formData;
        const phoneRegex = /^(?:\+\d{1,3}\s?)?\d{3}(?:\d{6,7})$/;

        if (Emp_ID === '' || Rating === '' || !Comments.trim()) {
            showAlert('All fields are required');
            return;
        }
        if (Emp_ID < 1) {
            showAlert('Staff ID cannot be less than 1');
            return;
        }
        if (Comments.length > 30) {
            showAlert('Limit of characters reached (30)');
            return;
        }

        const existingRating = rating.find(rating => rating.Emp_ID === Emp_ID);
        if (existingRating) {
            showAlert('Employee has already been rated');
            return;
        }

        try {
            await axios.get(`http://localhost:9004/api/staff/check/${Emp_ID}`,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            handleAddRating();
        } catch (error) {
            console.error('Error checking employee ID:', error);
            showAlert('Employee ID does not exist');
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
                <Typography variant="h6" component="h1" gutterBottom>Add Rating</Typography>
                <div className='bg-white rounded p-3'>
                    <div className='mb-2'>
                        <FormControl fullWidth>
                            <InputLabel id='Emp_ID-label'>Select Staff:</InputLabel>
                            <Select
                                labelId='Emp_ID-label'
                                id='Emp_ID'
                                name='Emp_ID'
                                value={formData.Emp_ID}
                                onChange={handleChange}
                            >
                                <MenuItem value=''><em>Select</em></MenuItem>
                                {staff.map(staffs => (
                                    <MenuItem key={staffs.Emp_ID} value={staffs.Emp_ID}>
                                        {`${staffs.Emp_Fname} ${staffs.Emp_Lname}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className='mb-2'>
                        <FormControl fullWidth>
                            <InputLabel id='Rating-label'>Rating:</InputLabel>
                            <Select
                                labelId='Rating-label'
                                id='Rating'
                                name='Rating'
                                value={formData.Rating}
                                onChange={handleChange}
                            >
                                <MenuItem value='' disabled>Select Rating</MenuItem>
                                <MenuItem value='1'>1</MenuItem>
                                <MenuItem value='2'>2</MenuItem>
                                <MenuItem value='3'>3</MenuItem>
                                <MenuItem value='4'>4</MenuItem>
                                <MenuItem value='5'>5</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className='mb-2'>
                        <TextField
                            fullWidth
                            label='Comment'
                            variant='outlined'
                            margin='normal'
                            name='Comments'
                            value={formData.Comments}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='mb-2'>
                        <TextField
                            fullWidth
                            label='Date'
                            type='date'
                            variant='outlined'
                            margin='normal'
                            name='Date'
                            value={formData.Date}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleValidation}
                            sx={{ mr: 1 }}
                        >
                            Submit
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
}

export default CreateRating;
