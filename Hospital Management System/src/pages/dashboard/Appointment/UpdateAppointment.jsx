import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ErrorModal from '../../../components/ErrorModal'; 

function UpdateAppointment({ id, onClose }) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Doctor_ID: '',
        Scheduled_On: '',
        Date: '',
        Time: '',
    });
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/appointment/${id}`);
                const data = response.data;
                setFormData(data);
            } catch (error) {
                console.error('Error fetching appointment:', error);
                showAlert('Error fetching appointment details.');
            }
        };

        fetchData();
    }, [id]);

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

    const handleUpdateAppointment = async () => {
        try {
            await axios.put(`http://localhost:9004/api/appointment/update/${id}`, formData);
            onClose(); // Close the modal after updating
            window.location.reload(); // Reload the page
        } catch (error) {
            console.error('Error updating appointment:', error);
            showAlert('Error updating appointment.');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <div className="bg-white p-8 mx-auto rounded-lg w-96">
                {showErrorModal && (
                    <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
                )}
                <h1 className="text-lg font-bold mb-4">Update Appointment</h1>
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
                <div className="flex justify-end">
                    <button type="button" className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleUpdateAppointment}>
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

export default UpdateAppointment;
