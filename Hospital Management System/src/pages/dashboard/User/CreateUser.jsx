import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';

function CreateUser() {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        fullName: '',
        phone: '',
    });

    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddUser = async () => {
        try {
            await axios.post('http://localhost:9004/api/users/create', formData);
            navigate('/dashboard/user');
            window.location.reload(); // Refresh the page after successful submission
        } catch (error) {
            console.error('Error adding user:', error);
            showAlert('Error adding user. Please try again.');
        }
    };

    const handleValidation = () => {
        const { email, username, password, fullName, phone } = formData;

        // Ensure all required fields are filled
        if (!email.trim() || !username.trim() || !password.trim() || !fullName.trim() || !phone.trim()) {
            showAlert('All fields are required');
            return;
        }

        // Proceed with form submission after successful validation
        handleAddUser();
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
        // Automatically hide the error modal after 3 seconds
        setTimeout(() => {
            setAlertMessage('');
            setShowErrorModal(false);
        }, 3000);
    };

    return (
        <div className='container mt-4'>
            {showErrorModal && (
                <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
            )}
            <div className='bg-white rounded p-3'>
                <div className='mb-2'>
                    <label htmlFor='userEmail'>Email:</label>
                    <input
                        type='text'
                        id='userEmail'
                        name='email'
                        placeholder='Enter Email'
                        className='form-control'
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='username'>Username:</label>
                    <input
                        type='text'
                        id='username'
                        name='username'
                        placeholder='Enter Username'
                        className='form-control'
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='password'>Password:</label>
                    <input
                        type='password'
                        id='password'
                        name='password'
                        placeholder='Enter Password'
                        className='form-control'
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='fullName'>Full Name:</label>
                    <input
                        type='text'
                        id='fullName'
                        name='fullName'
                        placeholder='Enter Full Name'
                        className='form-control'
                        value={formData.fullName}
                        onChange={handleChange}
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='phone'>Phone Number:</label>
                    <input
                        type='text'
                        id='phone'
                        name='phone'
                        placeholder='Enter Phone Number'
                        className='form-control'
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
                <button
                    type='button'
                    className='btn btn-success'
                    onClick={handleValidation}
                >
                    Submit
                </button>
            </div>
        </div>
    );
}

export default CreateUser;
