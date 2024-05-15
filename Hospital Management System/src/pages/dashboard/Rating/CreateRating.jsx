import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';

function CreateRating({onClose}) {
    const [formData, setFormData] = useState({
        Emp_ID: '',
        Rating: '',
        Comments: '',
        Date: new Date().toISOString().slice(0, 10), // Default to today's date
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
            showAlert('Error adding rating. Please try again.');
        }
    };

    const handleValidation = () => {
        const { Emp_ID, Rating, Comments, Date } = formData;

        // Ensure all required fields are filled
        if (Emp_ID === '' || Rating === '' || !Comments.trim()) {
            showAlert('All fields are required');
            return;
        }
        if (Emp_ID < 1) {
            showAlert('Staff ID cannot be less than 1');
            return;
        }
        if(Comments.length>30){
            showAlert('Limit of characters reached(30)');
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
        <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <div className="bg-white p-8 mx-auto rounded-lg w-96">
                {showErrorModal && (
                    <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
                )}
                <h1 className="text-lg font-bold mb-4">Add Rating</h1>
                <div className='bg-white rounded p-3'>
                    <div className='mb-2'>
                        <label htmlFor='Emp_ID'>Employee ID:</label>
                        <input
                            type='number'
                            id='Emp_ID'
                            name='Emp_ID'
                            placeholder='Enter Employee ID'
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
                            name='Comments'
                            placeholder='Enter Comment'
                            className='form-control'
                            value={formData.Comments}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor='Date'>Date:</label>
                        <input
                            type='date'
                            id='date'
                            name='Date'
                            placeholder='Enter Date'
                            className='form-control'
                            value={formData.Date}
                            onChange={handleChange}
                            disabled // Disable user input for date
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
                            onClick={onClose} // Call the onClose function passed from props
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
    
}

export default CreateRating;
