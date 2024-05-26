import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ErrorModal from '../../../components/ErrorModal';

function UpdateUser({ id, onClose }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const [users, setUsers] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/users/${id}`);
                const data = response.data;
                setOriginalData(data);
                setEmail(data.email);
                setUsername(data.username);
            } catch (error) {
                console.error('Error fetching user:', error);
                showAlert('Error fetching user details.');
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await axios.get('http://localhost:9004/api/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchAllUsers();
    }, []);

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
        // setTimeout(() => {
        //     setAlertMessage('');
        //     setShowErrorModal(false);
        // }, 3000);
    };

    const handleUpdateUser = async () => {
        // Basic validation
        if (!email.trim()) {
            showAlert('Email cannot be empty.');
            return;
        }

        if (!username.trim()) {
            showAlert('Username cannot be empty.');
            return;
        }

        // Ensure there are changes to update
        if (email === originalData.email && username === originalData.username) {
            showAlert('Data must be changed before updating.');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert('Invalid email address');
            return;
        }

        // Check if user with the same email or username already exists
    

        const existingUserByUsername = users.find(user => user.username === username && user.id !== id);
        if (existingUserByUsername) {
            showAlert('User with the same username already exists');
            return;
        }

        try {
            await axios.put(`http://localhost:9004/api/users/update/${id}`, {
                email: email,
                username: username,
            });

            // Close the modal after updating
            window.location.reload(); // Refresh the page to show the updated data
        } catch (error) {
            console.error('Error updating user:', error);
            showAlert('Error updating user. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <div className="bg-white p-8 mx-auto rounded-lg w-96">
                {showErrorModal && (
                    <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
                )}
                <h1 className="text-lg font-bold mb-4">Update User</h1>
                <div className='mb-4'>
                    <label htmlFor='userEmail'>Email:</label>
                    <input
                        type='email'
                        id='userEmail'
                        placeholder='Enter Email'
                        className='form-control w-full'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor='username'>Username:</label>
                    <input
                        type='text'
                        id='username'
                        placeholder='Enter Username'
                        className='form-control w-full'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleUpdateUser}
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

export default UpdateUser;
