import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';

function CreateNurse() {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Emp_ID: '',
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

    const handleAddNurse = async () => {
        try {
            await axios.post('http://localhost:9004/api/nurse/create', formData);
            navigate('/dashboard/nurse');
            window.location.reload();
        } catch (error) {
            console.error('Error adding nurse:', error);
            setAlertMessage('Error adding nurse. Please try again.');
            setShowErrorModal(true);
        }
    };

    const handleValidation = async () => {
        const { Patient_ID, Emp_ID } = formData;
        // Ensure all required fields are filled
        if ( Patient_ID === '' || Emp_ID === '') {
            showAlert('All fields are required');
            return;
        }
        if (Patient_ID < 1) {
            showAlert('Patient ID can not be less than 1');
            return;
        }
        if (Emp_ID < 1) {
            showAlert('Emp ID can not be less than 1');
            return;
        }
        try {
            await axios.get(`http://localhost:9004/api/patient/check/${Patient_ID}`);
        } catch (error) {
            console.error('Error checking patient ID:', error);
            showAlert('Patient ID does not exist');
            return;
        }

        try {
            await axios.get(`http://localhost:9004/api/staff/check/${Emp_ID}`);
        } catch (error) {
            console.error('Error checking staff ID:', error);
            showAlert('Staff ID does not exist');
            return;
        }
       // Proceed with form submission after successful validation
        handleAddNurse();
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
                    <label htmlFor='patient_ID'>Patient ID:</label>
                    <input
                        type='number'
                        id='patient_ID'
                        name='Patient_ID'
                        placeholder='Enter Patient ID'
                        className='form-control'
                        value={formData.Patient_ID}
                        onChange={handleChange}
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='emp_ID'>Employee ID:</label>
                    <input
                        type='number'
                        id='emp_ID'
                        name='Emp_ID'
                        placeholder='Enter Employee ID'
                        className='form-control'
                        value={formData.Emp_ID}
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

export default CreateNurse;
