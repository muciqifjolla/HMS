import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';

function CreateMedicine() {
    const [formData, setFormData] = useState({
        M_name: '',
        M_Quantity: '',
        M_Cost: '',
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

    const handleAddMedicine = async () => {
        try {
            await axios.post('http://localhost:9004/api/medicine/create', formData);
            navigate('/dashboard/medicines');
            window.location.reload(); // Refresh the page after successful submission
        } catch (error) {
            console.error('Error adding medicine:', error);
            showAlert('Error adding medicine. Please try again.');
        }
    };

    const handleValidation = () => {
        const { M_name, M_Quantity, M_Cost } = formData;

        // Ensure all required fields are filled
        if (!M_name.trim() || M_Quantity ==='' || M_Cost === '') {
            showAlert('All fields are required');
            return;
        }
        if(M_Quantity < 1){
            showAlert('Quantity can not be less than 1');
            return;
        }
        if(M_Cost < 1){
            showAlert('Cost can not be less than 1');
            return;
        }

        // Proceed with form submission after successful validation
        handleAddMedicine();
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
                    <label htmlFor='medicineName'>Medicine Name:</label>
                    <input
                        type='text'
                        id='medicineName'
                        name='M_name'
                        placeholder='Enter Medicine Name'
                        className='form-control'
                        value={formData.M_name}
                        onChange={handleChange}
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='medicineQuantity'>Quantity:</label>
                    <input
                        type='number'
                        id='medicineQuantity'
                        name='M_Quantity'
                        placeholder='Enter Quantity'
                        className='form-control'
                        value={formData.M_Quantity}
                        onChange={handleChange}
                    />
                </div>
                <div class='mb-2'>
                    <label htmlFor='medicineCost'>Cost:</label>
                    <input
                        type='number'
                        id='medicineCost'
                        name='M_Cost'
                        placeholder='Enter Cost'
                        className='form-control'
                        value={formData.M_Cost}
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
