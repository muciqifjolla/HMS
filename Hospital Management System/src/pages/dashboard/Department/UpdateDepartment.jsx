import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, InputAdornment } from '@mui/material';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';

function UpdateDepartment({ id, onClose }) {
    const [formData, setFormData] = useState({
        Dept_head: '',
        Dept_name: '',
        Emp_Count: '',
    });
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/department/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = response.data;
                setOriginalData(data);
                setFormData({
                    Dept_head: data.Dept_head,
                    Dept_name: data.Dept_name,
                    Emp_Count: data.Emp_Count
                });
            } catch (error) {
                console.error('Error fetching department:', error);
                showAlert('Error fetching department details.');
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleUpdateDepartment = async () => {
        // Basic validation
        if (!formData.Dept_head.trim() || formData.Dept_head.length < 2) {
            showAlert("Department head must be at least 2 characters long.");
            return;
        }

        if (!formData.Dept_name.trim()) {
            showAlert("Department name cannot be empty.");
            return;
        }

        if (!formData.Emp_Count || formData.Emp_Count < 1) {
            showAlert("Employee count must be at least 1.");
            return;
        }

        // Check if any data has been changed
        if (
            formData.Dept_head === originalData.Dept_head &&
            formData.Dept_name === originalData.Dept_name &&
            formData.Emp_Count === originalData.Emp_Count
        ) {
            showAlert('Data must be changed before updating.');
            return;
        }

        try {
            await axios.put(`http://localhost:9004/api/department/update/${id}`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            window.location.reload(); // Refresh the page to show the updated data
        } catch (error) {
            console.error('Error updating department:', error);
            if (error.response && error.response.data && error.response.data.error) {
                showAlert(error.response.data.error);
            } else {
                showAlert('Error updating department. Please try again.');
            }
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
                <Typography variant="h6" component="h1" gutterBottom>Update Department</Typography>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Department head"
                    variant="outlined"
                    id="Dept_head"
                    name="Dept_head"
                    value={formData.Dept_head}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Department name"
                    variant="outlined"
                    id="Dept_name"
                    name="Dept_name"
                    type="text"
                    value={formData.Dept_name}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Employee Count"
                    variant="outlined"
                    id="Emp_Count"
                    name="Emp_Count"
                    type="number"
                    value={formData.Emp_Count}
                    onChange={handleChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">Employees:</InputAdornment>
                    }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button type="submit" variant="contained" color="primary" onClick={handleUpdateDepartment} sx={{ mr: 1 }}>Submit</Button>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default UpdateDepartment;
