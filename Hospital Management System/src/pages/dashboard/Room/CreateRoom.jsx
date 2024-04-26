import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';

function CreateRoom() {
    const [formData, setFormData] = useState({
        Room_type: '',
        Patient_ID: '',
        Room_cost: '',
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

    const handleAddRoom = async () => {
        try {
            await axios.post('http://localhost:9004/api/room/create', formData);
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
            await axios.get(`http://localhost:9004/api/patient/check/${Patient_ID}`);
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
        <div className='container mt-4'>
            {showErrorModal && (
                <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
            )}
            <div className='bg-white rounded p-3'>
                <div className='mb-2'>
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
                <div className='mb-2'>
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
                <div className='mb-2'>
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

export default CreateRoom;
