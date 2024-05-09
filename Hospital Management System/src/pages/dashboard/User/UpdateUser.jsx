import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal'; // Ensure this component exists for error handling

function UpdateUser({ id }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/users/${id}`);
                const data = response.data;
                setOriginalData(data);
                setEmail(data.email);
                setUsername(data.username);
                setFullName(data.full_name);
                setPhone(data.phone);
            } catch (error) {
                console.error('Error fetching user:', error);
                showAlert('Error fetching user details.');
            }
        };

        fetchData();
    }, [id]);

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
        setTimeout(() => {
            setAlertMessage('');
            setShowErrorModal(false);
        }, 3000);
    };

    const handleUpdateUser = async () => {
        // Basic validation
        if (!email.trim()) {
            showAlert("Email cannot be empty.");
            return;
        }

        if (!username.trim()) {
            showAlert("Username cannot be empty.");
            return;
        }

        // Ensure there are changes to update
        if (
            email === originalData.email &&
            username === originalData.username &&
            fullName === originalData.full_name &&
            phone === originalData.phone
        ) {
            showAlert("Data must be changed before updating.");
            return;
        }

        try {
            await axios.put(`http://localhost:9004/api/users/update/${id}`, {
                email: email,
                username: username,
                full_name: fullName,
                phone: phone,
            });

            navigate('/dashboard/users'); // Navigate to the users dashboard after updating
            window.location.reload(); // Refresh the page to show the updated data
        } catch (error) {
            console.error('Error updating user:', error);
            showAlert('Error updating user. Please try again.');
        }
    };

    return (
        <div className="container mt-4">
            {showErrorModal && (
                <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
            )}
            <div className="bg-white rounded p-3">
                <div className="mb-2">
                    <label htmlFor="userEmail">Email:</label>
                    <input
                        type="email"
                        id="userEmail"
                        placeholder="Enter Email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-2">
                    <label htmlFor="userUsername">Username:</label>
                    <input
                        type="text"
                        id="userUsername"
                        placeholder="Enter Username"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="mb-2">
                    <label htmlFor="userFullName">Full Name:</label>
                    <input
                        type="text"
                        id="userFullName"
                        placeholder="Enter Full Name"
                        className="form-control"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </div>

                <div className="mb-2">
                    <label htmlFor="userPhone">Phone:</label>
                    <input
                        type="text"
                        id="userPhone"
                        placeholder="Enter Phone"
                        className="form-control"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>

                <button type="button" className="btn btn-success" onClick={handleUpdateUser}>
                    Submit
                </button>
            </div>
        </div>
    );
}

export default UpdateUser;
