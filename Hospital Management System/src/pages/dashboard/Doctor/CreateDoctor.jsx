import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';

function CreateDoctor({ onClose }) {
    const [formData, setFormData] = useState({
        Qualifications: '',
        Emp_ID: '',
        Specialization: '',
        user_id: '',
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

    const handleAddDoctor = async () => {
        try {
            await axios.post("http://localhost:9004/api/doctors/create", formData);
            navigate('/dashboard/doctors');
            window.location.reload(); // Refresh after successful addition
        } catch (error) {
            console.error('Error adding doctor:', error);
            showAlert('Error adding doctor. Please try again.');
        }
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

    const handleValidation = () => {
        const { Qualifications, Emp_ID, Specialization, user_id } = formData;

        if (Qualifications === '' || Emp_ID === '' || Specialization === '' || user_id === '') {
            showAlert('All fields are required!');
            return;
        }

        handleAddDoctor(); // All validations passed
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50'>
            <div className='bg-white p-8 mx-auto rounded-lg w-96'>
                {showErrorModal && (
                    <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
                )}
                <h1 className='text-lg font-bold mb-4'>Add Doctor</h1>
                {/* Qualifications */}
                <div className='mb-2'>
                    <label htmlFor='Qualifications'>Qualifications:</label>
                    <input
                        type='text'
                        name='Qualifications'
                        placeholder='Enter Qualifications'
                        className='form-control w-full'
                        value={formData.Qualifications}
                        onChange={handleChange}
                    />
                </div>
                {/* Emp_ID */}
                <div className='mb-2'>
                    <label htmlFor='Emp_ID'>Employee ID:</label>
                    <input
                        type='number'
                        name='Emp_ID'
                        placeholder='Enter Employee ID'
                        className='form-control w-full'
                        value={formData.Emp_ID}
                        onChange={handleChange}
                    />
                </div>
                {/* Specialization */}
                <div className='mb-2'>
                    <label htmlFor='Specialization'>Specialization:</label>
                    <input
                        type='text'
                        name='Specialization'
                        placeholder='Enter Specialization'
                        className='form-control w-full'
                        value={formData.Specialization}
                        onChange={handleChange}
                    />
                </div>
                {/* user_id */}
                <div className='mb-2'>
                    <label htmlFor='user_id'>User ID:</label>
                    <input
                        type='number'
                        name='user_id'
                        placeholder='Enter User ID'
                        className='form-control w-full'
                        value={formData.user_id}
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
                        onClick={onClose} // Call the onClose function passed from props
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateDoctor;