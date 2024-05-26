import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';

function CreateAppointment({ onClose }) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Doctor_ID: '',
        Scheduled_On: '',
        Date: '',
        Time: '',
    });
    const token = sessionStorage.getItem('token'); // Retrieve the token from localStorage

    const [appointment, setAppointment] = useState([]);
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
    useEffect(() => {
        // Fetch existing appointments when component mounts
        fetchAppointment();
    }, []);

    const fetchAppointment = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/appointment',
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            );
            await axios.get('http://localhost:9004/api/appointment', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setAppointment(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const handleAddAppointment = async () => {

        try {
            await axios.post('http://localhost:9004/api/appointment/create', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/dashboard/appointments');
        } catch (error) {
            console.error('Error adding appointment:', error);
            showAlert(error.response.data.message);
        }
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
        // Automatically hide the error modal after 3 seconds
        setTimeout(() => setShowErrorModal(false), 3000);
    };

    const handleValidation = async () => {
        const { Patient_ID, Doctor_ID, Scheduled_On, Date, Time } = formData;
    
        if (Patient_ID === '' || Doctor_ID === '' || Scheduled_On === '' || Date === '' || Time === '') {
            showAlert('All fields are required!');
            return;
        }
        if (Patient_ID < 1 ){
            showAlert('Patient ID cannot be less than 1');
            return;
        }
        if (Doctor_ID < 1) {
            showAlert('Doctor ID cannot be less than 1');
            return;
        }

        try {
            await axios.get(`http://localhost:9004/api/patient/check/${Patient_ID}`);
            // Proceed with form submission after successful validation
            handleAddAppointment();
        } catch (error) {
            console.error('Error checking patient ID:', error);
            showAlert('Patient ID does not exist');
        }
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50'>
            <div className='bg-white p-8 mx-auto rounded-lg w-96'>
                {showErrorModal && (
                    <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
                )}
                <h1 className='text-lg font-bold mb-4'>Add Appointment</h1>
                {/* Patient ID */}
                <div className='mb-2'>
                    <label htmlFor='Patient_ID'>Patient ID:</label>
                    <input
                        type='number'
                        name='Patient_ID'
                        placeholder='Enter Patient ID'
                        className='form-control w-full'
                        value={formData.Patient_ID}
                        onChange={handleChange}
                    />
                </div>
                {/* Doctor ID */}
                <div className='mb-2'>
                    <label htmlFor='Doctor_ID'>Doctor ID:</label>
                    <input
                        type='number'
                        name='Doctor_ID'
                        placeholder='Enter Doctor ID'
                        className='form-control w-full'
                        value={formData.Doctor_ID}
                        onChange={handleChange}
                    />
                </div>
                {/* Scheduled On */}
                <div className='mb-2'>
                    <label htmlFor='Scheduled_On'>Scheduled On:</label>
                    <input
                        type='date'
                        name='Scheduled_On'
                        placeholder='Scheduled on'
                        className='form-control w-full'
                        value={formData.Scheduled_On}
                        onChange={handleChange}
                    />
                </div>
                {/* Date */}
                <div className='mb-2'>
                    <label htmlFor='Date'>Date:</label>
                    <input
                        type='date'
                        name='Date'
                        placeholder='Enter Date'
                        className='form-control w-full'
                        value={formData.Date}
                        onChange={handleChange}
                    />
                </div>
                {/* Time */}
                <div className='mb-2'>
                    <label htmlFor='Time'>Time:</label>
                    <input
                        type='time'
                        name='Time'
                        placeholder='Select Time'
                        className='form-control w-full'
                        value={formData.Time}
                        onChange={handleChange}
                    />
                </div>
                <div className='flex justify-end'>
                    <button
                        className='bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
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

export default CreateAppointment;
