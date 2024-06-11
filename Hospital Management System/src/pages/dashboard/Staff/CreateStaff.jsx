import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl, Modal } from '@mui/material';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';

function CreateStaff({ onClose }) {
    const [formData, setFormData] = useState({
        Emp_Fname: '',
        Emp_Lname: '',
        Joining_Date: '',
        Emp_type: '',
        Email: '',
        Address: '',
        Dept_ID: '',
        SSN: '',
        DOB: '',
        Date_Separation: '',
    });
    const [staff, setStaff] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [department, setDepartments] = useState([]);
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/department', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };
    useEffect(() => {
        fetchStaff();
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };


    const handleAddStaff = async () => {
        try {
            await axios.post("http://localhost:9004/api/staff/create", formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/dashboard/staffs');
            window.location.reload(); // Refresh after successful addition
        } catch (error) {
            console.error('Error adding Staff:', error);
            showAlert(error.response.data.error);
        }
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    const handleValidation = async () => {
        const {
            Emp_Fname,
            Emp_Lname,
            Joining_Date,
            Emp_type,
            Email,
            Address,
            Dept_ID,
            SSN,
            DOB,
            Date_Separation,
        } = formData;

        if (!Emp_Fname || !Emp_Lname || !Joining_Date || !Emp_type || !Email || !Address || !Dept_ID || !SSN || !DOB || !Date_Separation) {
            showAlert('All fields are required!');
            return;
        }

        function validateEmail(Email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(Email).toLowerCase());
        }

        if (!validateEmail(Email)) {
            showAlert('Invalid email format');
            return;
        }

        const existingStaff = staff.find(staff => staff.SSN === SSN);
        if (existingStaff) {
            showAlert('Staff member with the same SSN already exists.');
            return;
        }

        handleAddStaff();
    };
    

    return (
        <Modal open onClose={onClose} className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 400, mx: 'auto' }}>
                {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}
                <Typography variant="h6" component="h1" gutterBottom>Add Staff</Typography>
                <TextField
                    fullWidth
                    margin="normal"
                    label="First Name"
                    variant="outlined"
                    id="Emp_Fname"
                    name="Emp_Fname"
                    placeholder="Enter First Name"
                    value={formData.Emp_Fname}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Last Name"
                    variant="outlined"
                    id="Emp_Lname"
                    name="Emp_Lname"
                    placeholder="Enter Last Name"
                    value={formData.Emp_Lname}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Joining Date"
                    variant="outlined"
                    type="date"
                    id="Joining_Date"
                    name="Joining_Date"
                    value={formData.Joining_Date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                />
                <FormControl fullWidth margin="normal" variant="outlined">
                    <InputLabel id="emp-type-select-label">Employee Type</InputLabel>
                    <Select
                        labelId="emp-type-select-label"
                        id="Emp_type"
                        name="Emp_type"
                        value={formData.Emp_type}
                        onChange={handleChange}
                        label="Employee Type"
                    >
                        <MenuItem value=""><em>Select Employee Type</em></MenuItem>
                        <MenuItem value="Doctor">Doctor</MenuItem>
                        <MenuItem value="Nurse">Nurse</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    variant="outlined"
                    id="Email"
                    name="Email"
                    placeholder="Enter Email"
                    value={formData.Email}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Address"
                    variant="outlined"
                    id="Address"
                    name="Address"
                    placeholder="Enter Address"
                    value={formData.Address}
                    onChange={handleChange}
                />
                <FormControl fullWidth variant="outlined" margin="normal">
                        <InputLabel id="department-select-label">Department</InputLabel>
                        <Select
                            labelId="patient-department-select-label-label"
                            id="visitDepartmentID"
                            name="Dept_ID"
                            value={formData.Dept_ID}
                            onChange={handleChange}
                            label="Department"
                        >
                            <MenuItem value=""><em>Select Department</em></MenuItem>
                            {department.map(departmenttype => (
                                <MenuItem key={departmenttype.Dept_ID} value={departmenttype.Dept_ID}>
                                    {`${departmenttype.Dept_name}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                <TextField
                    fullWidth
                    margin="normal"
                    label="SSN"
                    variant="outlined"
                    id="SSN"
                    name="SSN"
                    placeholder="Enter SSN"
                    value={formData.SSN}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Date of Birth"
                    variant="outlined"
                    type="date"
                    id="DOB"
                    name="DOB"
                    value={formData.DOB}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Date of Separation"
                    variant="outlined"
                    type="date"
                    id="Date_Separation"
                    name="Date_Separation"
                    value={formData.Date_Separation}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleValidation} sx={{ mr: 1 }}>Submit</Button>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default CreateStaff;