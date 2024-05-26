import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';

function CreateUser() {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
    });

    const [users, setUsers] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch existing users when component mounts
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/users',{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prevState) => ({
    //         ...prevState,
    //         [name]: value,
    //     }));
    // };

    const handleAddUser = async () => {
        try {
            await axios.post('http://localhost:9004/api/users/create', formData,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
             navigate('/dashboard/user');
            window.location.reload(); // Refresh the page after successful submission
        } catch (error) {
            console.error('Error adding user:', error);
            showAlert('Error adding user. Please try again.');
        }
    };

   

    const handleValidation = async () => {
        const { email, username, password } = formData;

        // Ensure all required fields are filled
        if (!email.trim() || !username.trim() || !password.trim()) {
            showAlert('All fields are required');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert('Invalid email address');
            return;
        }

        // Validate username length
        if (username.length < 3) {
            showAlert('Username must be at least 3 characters long');
            return;
        }

        // Validate password length
        if (password.length < 6) {
            showAlert('Password must be at least 6 characters long');
            return;
        }

        // Check if user with the same email or username already exists
        // const existingUserByUsername = users.find(user => user.username === username);
        // if (existingUserByUsername) {
        //     showAlert('User with the same username already exists');
        //     return;
        // }

        const existingUserByUsername = users.find(user => user.username === username);
        if (existingUserByUsername) {
            showAlert('User with the same username already exists');
            return;
        }

        // Proceed with form submission after successful validation
        handleAddUser();
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
        // Automatically hide the error modal after 3 seconds
        // setTimeout(() => {
        //     setAlertMessage('');
        //     setShowErrorModal(false);
        // }, 5000);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <div className="bg-white p-8 mx-auto rounded-lg w-96">
                {showErrorModal && (
                    <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
                )}
                <h1 className="text-lg font-bold mb-4">Add User</h1>
                <div className='mb-4'>
                    <label htmlFor='userEmail'>Email:</label>
                    <input
                        type='text'
                        id='userEmail'
                        name='email'
                        placeholder='Enter Email'
                        className='form-control w-full'
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor='username'>Username:</label>
                    <input
                        type='text'
                        id='username'
                        name='username'
                        placeholder='Enter Username'
                        className='form-control w-full'
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor='password'>Password:</label>
                    <input
                        type='password'
                        id='password'
                        name='password'
                        placeholder='Enter Password'
                        className='form-control w-full'
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleValidation}
                    >
                        Submit
                    </button>
                    <button
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 ml-2 rounded"
                        onClick={onClose} // Call the onClose function passed from props
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateUser;
