import axios from 'axios';
import React, { useState, useEffect } from 'react'; // Added useEffect
import { useNavigate } from 'react-router-dom';
import { Modal, Box, TextField, Button, Typography, InputAdornment } from '@mui/material';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie'; // Import js-cookie

function CreateDepartment({ onClose }) {
    const [formData, setFormData] = useState({
        Dept_head: '',
        Dept_name: '',
        Emp_Count: '',
    });

    const [departments, setDepartments] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/medicine',{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddDepartment = async () => {
        try {
            await axios.post('http://localhost:9004/api/department/create', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            )
            navigate('/dashboard/department');
            window.location.reload();
        } catch (error) {
            console.error('Error adding Department:', error);
            setAlertMessage('Error adding Department. Please try again.');   
        }
    };

    const handleValidation = () => {
        const { Dept_head, Dept_name, Emp_Count } = formData;

        if (!Dept_head.trim() || !Dept_name.trim() || !Emp_Count ==='') {
            showAlert('All fields are required');
            return;
        }
        if (Dept_head.length < 2) {
            showAlert('Head can not be less than 1');
            return;
        }
        if (Dept_name.length < 2) {
            showAlert('Name can not be less than 1');
            return;
        }
        if (Emp_Count < 1) {
            showAlert('employee can not be less than 1');
            return;
        }

       // Check if department with the same name already exists
        const existingDepartment = departments.find(department => department.Dept_name === Dept_name);
        if (existingDepartment) {
            showAlert('Department with the same name already exists');
            return;
        }

    // Proceed with form submission after successful validation
        handleAddDepartment();
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    return (
        <Modal open onClose={onClose} className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 400, mx: 'auto' }}>
            {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}
            <Typography variant="h6" component="h1" gutterBottom>Add Department</Typography>
            <Box mb={2}>
                <TextField                    
                    fullWidth
                    label="Department Head"
                    variant="outlined"
                    id="dept_head"
                    name="Dept_head"
                    type="text"
                    value={formData.Dept_head}
                    onChange={handleChange}
                        />
                </Box>
                <Box mb={2}>
                    <TextField
                        fullWidth 
                        label="Department Name" 
                        variant="outlined"                          
                        id='dept_name'
                        name='Dept_name'
                        type="text"
                        value={formData.Dept_name}
                        onChange={handleChange}
                        />
                </Box>
                <Box mb={2}>
                    <TextField
                    fullWidth
                    label="Employee Count" 
                    variant="outlined"                          
                    id='emp_Count'
                    name='Emp_Count'
                    type="number"
                    value={formData.Emp_Count}
                    onChange={handleChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">Employees:</InputAdornment>,
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


export default CreateDepartment;
