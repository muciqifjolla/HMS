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
    const [departments, setDepartments] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const staffResponse = await axios.get(`http://localhost:9004/api/staff/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = staffResponse.data;
                setFormData(data);

                const departmentResponse = await axios.get(`http://localhost:9004/api/department/${data.Dept_ID}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setDepartments([departmentResponse.data]);
            } catch (error) {
                console.error('Error fetching staff details:', error);
                showAlert('Error fetching staff details.');
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
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleUpdateStaff = async () => {
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
    };

    const closeErrorModal = () => {
        setShowErrorModal(false);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <div className="bg-white p-8 mx-auto rounded-lg w-96">
                {showErrorModal && <ErrorModal message={alertMessage} onClose={closeErrorModal} />}
                <h1 className="text-lg font-bold mb-4">Update Staff</h1>
                <div className='mb-2'>
                    <label htmlFor='Emp_ID'>Employee ID:</label>
                    <input
                        type='text'
                        name='Emp_ID'
                        className='form-control w-full'
                        value={formData.Emp_ID}
                        readOnly
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='Emp_Fname'>First Name:</label>
                    <input
                        type='text'
                        name='Emp_Fname'
                        className='form-control w-full'
                        value={formData.Emp_Fname}
                        onChange={handleChange}
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='Emp_Lname'>Last Name:</label>
                    <input
                        type='text'
                        name='Emp_Lname'
                        className='form-control w-full'
                        value={formData.Emp_Lname}
                        onChange={handleChange}
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='Joining_Date'>Joining Date:</label>
                    <input
                        type='date'
                        name='Joining_Date'
                        className='form-control w-full'
                        value={formData.Joining_Date}
                        onChange={handleChange}
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='Emp_type'>Employee Type:</label>
                    <input
                        type='text'
                        name='Emp_type'
                        className='form-control w-full'
                        value={formData.Emp_type}
                        onChange={handleChange}
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='Email'>Email:</label>
                    <input
                        type='email'
                        name='Email'
                        className='form-control w-full'
                        value={formData.Email}
                        onChange={handleChange}
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='Address'>Address:</label>
                    <input
                        type='text'
                        name='Address'
                        className='form-control w-full'
                        value={formData.Address}
                        onChange={handleChange}
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='Dept_ID'>Department:</label>
                    <select
                        name='Dept_ID'
                        className='form-control w-full'
                        value={formData.Dept_ID}
                        onChange={handleChange}
                    >
                        {departments.map(department => (
                            <option key={department.Dept_ID} value={department.Dept_ID}>
                                {department.Dept_Name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='mb-2'>
                    <label htmlFor='SSN'>SSN:</label>
                    <input
                        type='text'
                        name='SSN'
                        className='form-control w-full'
                        value={formData.SSN}
                        onChange={handleChange}
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='DOB'>Date of Birth:</label>
                    <input
                        type='date'
                        name='DOB'
                        className='form-control w-full'
                        value={formData.DOB}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex justify-end">
                    <button type="button" className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleUpdateStaff}>
                        Submit
                    </button>
                    <button
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 ml-2 rounded"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UpdateStaff;