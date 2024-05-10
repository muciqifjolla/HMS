import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';

function CreateMedicine() {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Emp_ID: '',
        Rating: '',
        Comments: '',
        Date: '',
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

    const handleAddRating = async () => {
        try {
            await axios.post('http://localhost:9004/api/rating/create', formData);
            navigate('/dashboard/rating');
            window.location.reload(); // Refresh the page after successful submission
        } catch (error) {
            console.error('Error adding rating:', error);
            // console.log(error);
            showAlert('Error adding ratin11g. Please try again.');
        }
    };

    const handleValidation = () => {
        const { Patient_ID, Emp_ID, Rating, Comments,  Date} = formData;

        // Ensure all required fields are filled
        if (Patient_ID ==='' || Emp_ID==='' || Rating==='' || !Comments.trim() || Date ==='') {
            showAlert('All fields are required');
            return;
        }
        if(Patient_ID < 1){
            showAlert('Patient ID can not be less than 1');
            return;
        }
        if(Emp_ID < 1){
            showAlert('Staff ID can not be less than 1');
            return;
        }

        // Proceed with form submission after successful validation
        handleAddRating();
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

    return (
        <div className='container mt-4'>
            {showErrorModal && (
                <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
            )}
            <div className='bg-white rounded p-3'>
                <div className='mb-2'>
                    <label htmlFor='Patient_ID'>Patient_ID:</label>
                    <input
                        type='number'
                        id='Patient_ID'
                        name='Patient_ID'
                        placeholder='Enter Patient_ID'
                        className='form-control'
                        value={formData.Patient_ID}
                        onChange={handleChange}
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='Emp_ID'>Emp_ID:</label>
                    <input
                        type='number'
                        id='Emp_ID'
                        name='Emp_ID'
                        placeholder='Enter Emp ID'
                        className='form-control'
                        value={formData.Emp_ID}
                        onChange={handleChange}
                    />
                </div>
                <div className='mb-2'>
                <label htmlFor='Rating'>Rating:</label>
                <select
                    id='Rating'
                    name='Rating'
                    className='form-control'
                    value={formData.Rating}
                    onChange={handleChange}
                >
                    <option value='' disabled>Select Rating</option>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                    <option value='5'>5</option>
                </select>
                </div>
                <div className='mb-2'>
                <label htmlFor='Comment'>Comment:</label>
                <input
                    type='text'
                    id='Comment'
                    name='Comments' // Changed to 'Comments' to match formData
                    placeholder='Enter Comment'
                    className='form-control'
                    value={formData.Comments} // Updated to match formData's 'Comments' property
                    onChange={handleChange} // This should work as expected with the corrected name
                />
                </div>
                <div class='mb-2'>
                    <label htmlFor='Date'>Date:</label>
                    <input
                        type='date'
                        id='date'
                        name='Date'
                        placeholder='Enter Date'
                        className='form-control'
                        value={formData.Date}
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

export default CreateMedicine;
