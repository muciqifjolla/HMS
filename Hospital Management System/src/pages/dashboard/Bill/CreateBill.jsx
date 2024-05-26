import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';

function CreateBill({ onClose }) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Room_ID: '',
        Medicine_ID: '',
        DATE: '',
        Other_charges: '',
    });

    const [bills, setBills] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token'); // Retrieve the token from localStorage


    useEffect(() => {
        // Fetch existing medicines when component mounts
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/bills',{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setBills(response.data);
        } catch (error) {
            console.error('Error fetching medicines:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddBills = async () => {
        try {
            await axios.post('http://localhost:9004/api/bills/create', formData,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            navigate('/dashboard/bills');
            window.location.reload(); // Refresh the page after successful submission
        } catch (error) {
            console.error('Error adding medicine:', error);
        }
    };

    const handleValidation = () => {
        const {
            Patient_ID,
            Room_ID,
            Medicine_ID,
            DATE,
            Other_charges,
        } = formData;

        if (Patient_ID === '' || Room_ID === '' || Medicine_ID === '' || DATE === '' || Other_charges === '') {
            showAlert('All fields are required!');
            return;
        }
       
        // Proceed with form submission after successful validation
        handleAddBills();
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
        // Automatically hide the error modal after 3 seconds
        // setTimeout(() => {
        //     setAlertMessage('');
        //     setShowErrorModal(false);
        // }, 3000);
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50'>
            <div className='bg-white p-8 mx-auto rounded-lg w-96'>
                {showErrorModal && (
                    <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
                )}
                <h1 className='text-lg font-bold mb-4'>Add Bill</h1>
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
                {/* Room_ID */}
                <div className='mb-2'>
                    <label htmlFor='Room_ID'>Room ID:</label>
                    <input
                        type='text'
                        name='Room_ID'
                        placeholder='Enter Room ID'
                        className='form-control w-full'
                        value={formData.Room_ID}
                        onChange={handleChange}
                    />
                </div>

                {/* Medicine_ID */}
                <div className='mb-2'>
                    <label htmlFor='Medicine_ID'>Medicine ID:</label>
                    <input
                        type='text'
                        name='Medicine_ID'
                        placeholder='Enter Medicine ID'
                        className='form-control w-full'
                        value={formData.Medicine_ID}
                        onChange={handleChange}
                    />
                </div>
                {/* Date */}
                <div className='mb-2'>
                    <label htmlFor='Date'>Date:</label>
                    <input
                        type='date'
                        name='DATE'
                        placeholder='Enter Date'
                        className='form-control w-full'
                        value={formData.DATE}
                        onChange={handleChange}
                    />
                </div>
                {/* Other_charges */}
                <div className='mb-2'>
                    <label htmlFor='Other_charges'>Other Charges:</label>
                    <input
                        type='number'
                        name='Other_charges'
                        placeholder='Enter Other Charges'
                        className='form-control w-full'
                        value={formData.Other_charges}
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

export default CreateBill;