import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';


function CreateRoom({ onClose }) {
    const [formData, setFormData] = useState({
        Room_type: '',
        Patient_ID: '',
        Room_cost: '',
    });

    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get('token');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddRoom = async () => {
        try {
            await axios.post('http://localhost:9004/api/room/create', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/dashboard/room');
            window.location.reload();
        } catch (error) {
            console.error('Error adding room:', error);
            setAlertMessage('Error adding room. Please try again.');
            setShowErrorModal(true);
        }
    };

    const handleValidation = async () => {
        const { Room_type, Patient_ID, Room_cost } = formData;

        if (Room_type === '' || Patient_ID === '' || Room_cost === '') {
            showAlert('All fields are required');
            return;
        }
        if (parseInt(Patient_ID) < 1) {
            showAlert('Patient ID can not be less than 1');
            return;
        }
        if (!isValidDecimal(Room_cost)) {
            showAlert('Cost must be a valid decimal (10.2)');
            return;
        }

        try {
            await axios.get(`http://localhost:9004/api/patient/check/${Patient_ID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error checking patient ID:', error);
            showAlert('Patient ID does not exist');
            return;
        }

        handleAddRoom();
    };

    const isValidDecimal = (value) => {
        const decimalRegex = /^\d{0,8}(\.\d{1,2})?$/;
        return decimalRegex.test(value);
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
        <div className="bg-white p-8 mx-auto rounded-lg w-96">
            {showErrorModal && (
                <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
            )}
            <h1 className="text-lg font-bold mb-4">Add Room</h1>
                <div className='mb-4'>
                    <label htmlFor='roomType'>Room Type:</label>
                    <input
                        type='text'
                        id='roomType'
                        name='Room_type'
                        placeholder='Enter Room Type'
                        className='form-control'
                        value={formData.Room_type}
                        onChange={handleChange}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor='roomPatientID'>Patient ID:</label>
                    <input
                        type='number'
                        id='roomPatientID'
                        name='Patient_ID'
                        placeholder='Enter Patient ID'
                        className='form-control'
                        value={formData.Patient_ID}
                        onChange={handleChange}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor='roomCost'>Cost (in €):</label>
                    <input
                        type='number'
                        id='roomCost'
                        name='Room_cost'
                        placeholder='Enter Cost'
                        className='form-control'
                        value={formData.Room_cost}
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
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateRoom;
