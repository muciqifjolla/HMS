import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';

function UpdateRoom({ id, onClose }) {
    const [roomType, setRoomType] = useState('');
    const [patientID, setPatientID] = useState('');
    const [cost, setCost] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/room/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const responseData = response.data;
                setOriginalData(responseData);
                setRoomType(responseData.Room_type);
                setPatientID(responseData.Patient_ID);
                setCost(responseData.Room_cost);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    // Handle unauthorized access
                    console.error('Unauthorized access - perhaps the token is invalid or expired');
                    setAlertMessage('Invalid or expired authentication token. Please log in again.');
                } else {
                    console.error('Error fetching room:', error);
                    setAlertMessage('Error fetching room details.');
                }
                setShowErrorModal(true);
            }
        };

        fetchData();
    }, [id, token]);

    const handleUpdateRoom = async () => {
        if (roomType === '' || patientID === '' || cost === '') {
            showAlert('All fields are required');
            return;
        }

        if (
            roomType === originalData.Room_type &&
            parseInt(patientID) === parseInt(originalData.Patient_ID) &&
            parseInt(cost) === parseInt(originalData.Room_cost)
        ) {
            setAlertMessage("Data must be changed before updating.");
            setShowErrorModal(true);
            return;
        }

        if (parseInt(patientID) < 1) {
            showAlert("Patient ID must be at least 1.");
            return;
        }

        if (!isValidDecimal(cost)) {
            showAlert('Cost must be a valid decimal (10.2)');
            return;
        }

        try {
            // Check if patient ID exists
            await axios.get(`http://localhost:9004/api/patient/check/${patientID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error checking patient ID:', error);
            showAlert('Patient ID does not exist');
            return;
        }

        try {
            await axios.put(`http://localhost:9004/api/room/update/${id}`, {
                Room_type: roomType,
                Patient_ID: patientID,
                Room_cost: cost,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            navigate('/dashboard/room');
            window.location.reload();
        } catch (error) {
            console.error('Error updating room:', error);
            setAlertMessage('Error updating room.');
            setShowErrorModal(true);
        }
    };

    const isValidDecimal = (value) => {
        const decimalRegex = /^\d{0,8}(\.\d{1,2})?$/;
        return decimalRegex.test(value);
    };

    const closeErrorModal = () => {
        setShowErrorModal(false);
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <div className="bg-white p-8 mx-auto rounded-lg w-96">
                {showErrorModal && <ErrorModal message={alertMessage} onClose={closeErrorModal} />}
                <h1 className="text-lg font-bold mb-4">Update Room</h1>
                <div className='mb-4'>
                    <label htmlFor="roomType">Room Type: </label>
                    <input
                        type='text' id="roomType" placeholder='Enter Room Type' className='form-control' value={roomType}
                        onChange={e => setRoomType(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="roomPatientID">Patient ID:</label>
                    <input
                        type='number'
                        id='roomPatientID'
                        name='Patient_ID'
                        placeholder='Enter Patient ID'
                        className='form-control'
                        value={patientID}
                        onChange={e => setPatientID(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="roomCost">Cost (in €):</label>
                    <input
                        type='number'
                        id='roomCost'
                        name='Room_cost'
                        placeholder='Enter Cost'
                        className='form-control'
                        value={cost}
                        onChange={e => setCost(e.target.value)}
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleUpdateRoom}
                    >
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

export default UpdateRoom;
