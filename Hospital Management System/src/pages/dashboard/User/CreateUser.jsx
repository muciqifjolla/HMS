import React, { useState, useEffect, lazy, Suspense } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Modal, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Cookies from 'js-cookie';

const ErrorModal = lazy(() => import('../../../components/ErrorModal'));

function CreateUser({ onClose }) {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        role: 'patient' // Default role set to 'patient'
    });

    const [users, setUsers] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            if (!token) {
                console.error('Token is missing');
                showAlert('Authentication token is missing');
                return;
            }

            console.log('Token:', token); // Debug log to check if token is retrieved correctly

            const response = await axios.get('http://localhost:9004/api/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            showAlert('Error fetching users. Please try again.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddUser = async () => {
        try {
            if (!token) {
                console.error('Token is missing');
                showAlert('Authentication token is missing');
                return;
            }

            console.log('Token:', token); // Debug log to check if token is retrieved correctly

            await axios.post('http://localhost:9004/api/users/create', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/dashboard/user');
            window.location.reload(); // Refresh the page after successful submission
        } catch (error) {
            console.error('Error adding user:', error.response?.data || error.message);
            showAlert('Error adding user. Please try again.');
        }
    };

    const handleValidation = () => {
        const { email, username, password, role } = formData;

        if (!email.trim() || !username.trim() || !password.trim() || !role.trim()) {
            showAlert('All fields are required');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert('Invalid email address');
            return;
        }

        if (username.length < 3) {
            showAlert('Username must be at least 3 characters long');
            return;
        }

        if (password.length < 6) {
            showAlert('Password must be at least 6 characters long');
            return;
        }

        const existingUserByUsername = users.find(user => user.username === username);
        if (existingUserByUsername) {
            showAlert('User with the same username already exists');
            return;
        }

        handleAddUser();
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    return (
        <Modal open onClose={onClose} className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 400, mx: 'auto' }}>
                <Suspense fallback={<div>Loading...</div>}>
                    {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}
                </Suspense>
                <Typography variant="h6" component="h1" gutterBottom>Add User</Typography>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    variant="outlined"
                    id="email"
                    name="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Username"
                    variant="outlined"
                    id="username"
                    name="username"
                    placeholder="Enter Username"
                    value={formData.username}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Password"
                    variant="outlined"
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                        labelId="role-label"
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        label="Role"
                    >
                        <MenuItem value="patient">Patient</MenuItem>
                        <MenuItem value="doctor">Doctor</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
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

export default CreateUser;
