import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl, Modal } from '@mui/material';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';

function UpdateStaff({ id, onClose }) {
    const [formData, setFormData] = useState({
        Emp_ID: '',
        Emp_Fname: '',
        Emp_Lname: '',
        Joining_Date: '',
        Emp_type: '',
        Email: '',
        Address: '',
        Dept_ID: '',
        SSN: '',
        DOB: '',
    });
    const [department, setDepartments] = useState([]); // Change 'department' to 'departments'

    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        fetchStaffDetails();
        fetchDepartments();
    }, [id]);

    const fetchStaffDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:9004/api/staff/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = response.data;
            setFormData(data);
        } catch (error) {
            console.error('Error fetching staff details:', error);
            showAlert('Error fetching staff details.');
        }
    };
    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/department', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setPatients(response.data);
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

    const handleValidation = async () => {
        const { Patient_ID, Doctor_ID, Date, Time, Scheduled_On } = formData;

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
        

        try {
            await axios.put(`http://localhost:9004/api/staff/update/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            onClose(); // Close the modal after updating
            window.location.reload(); // Reload the page
        } catch (error) {
            console.error('Error updating staff:', error);
            showAlert('Error updating staff.');
        }
        handleAddStaff();
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };


    return (
        <Modal open onClose={onClose}>
            <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 400, mx: 'auto' }}>
                {showErrorModal && <ErrorModal message={alertMessage} onClose={closeErrorModal} />}
                <Typography variant="h6" component="h1" gutterBottom>Update Staff</Typography>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Employee ID"
                    variant="outlined"
                    id="Emp_ID"
                    name="Emp_ID"
                    value={formData.Emp_ID}
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="First Name"
                    variant="outlined"
                    id="Emp_Fname"
                    name="Emp_Fname"
                    value={formData.Emp_Fname}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Last Name"
                    variant="outlined"
                    id="Emp_Lname"
                    name="Emp_Lname"
                    value={formData.Emp_Lname}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Joining Date"
                    variant="outlined"
                    type="date"
                    id="Joining_Date"
                    name="Joining_Date"
                    value={formData.Joining_Date}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Employee Type"
                    variant="outlined"
                    id="Emp_type"
                    name="Emp_type"
                    value={formData.Emp_type}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Email"
                    variant="outlined"
                    id="Email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Address"
                    variant="outlined"
                    id="Address"
                    name="Address"
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
                    margin="normal"
                    fullWidth
                    label="SSN"
                    variant="outlined"
                    id="SSN"
                    name="SSN"
                    value={formData.SSN}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Date of Birth"
                    variant="outlined"
                    type="date"
                    id="DOB"
                    name="DOB"
                    value={formData.DOB}
                    onChange={handleChange}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleValidation} sx={{ mr: 1 }}>Submit</Button>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default UpdateStaff;
