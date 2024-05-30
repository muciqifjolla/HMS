import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';

function CreateBill({ onClose }) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Date_Issued: '',
        Description: '',
        Amount: '',
        Payment_Status: '',
    });
    const [patients, setPatients] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const token = Cookies.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/patient', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddBill = async () => {
        try {
            await axios.post('http://localhost:9004/api/bills/create', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/dashboard/bills');
            window.location.reload(); // Refresh after successful addition
        } catch (error) {
            console.error('Error adding Bill:', error);
            showAlert(error.response?.data?.message || 'Error adding bill. Please try again.');
        }
    };

    const handleValidation = async () => {
        const { Patient_ID, Date_Issued, Description, Amount, Payment_Status } = formData;

        if (Patient_ID === '' || Date_Issued === '' || Description === '' || Amount === '' || Payment_Status === '') {
            showAlert('All fields are required');
            return;
        }

        if (parseInt(Patient_ID) < 1) {
            showAlert('Patient ID cannot be less than 1');
            return;
        }

        try {
            await axios.get(`http://localhost:9004/api/patient/check/${Patient_ID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            handleAddBill();
        } catch (error) {
            console.error('Error checking patient ID:', error);
            showAlert('Patient ID does not exist');
        }
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
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
                    <label htmlFor='Patient_ID'>Patient:</label>
                    <select
                        id='Patient_ID'
                        name='Patient_ID'
                        className='form-control'
                        value={formData.Patient_ID}
                        onChange={handleChange}
                    >
                        <option value=''>Select Patient</option>
                        {patients.map(patient => (
                            <option key={patient.Patient_ID} value={patient.Patient_ID}>
                                {`${patient.Patient_Fname} ${patient.Patient_Lname}`}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Date Issued */}
                <div className='mb-2'>
                    <label htmlFor='Date_Issued'>Date Issued:</label>
                    <input
                        type='date'
                        name='Date_Issued'
                        className='form-control w-full'
                        value={formData.Date_Issued}
                        onChange={handleChange}
                    />
                </div>
                {/* Description */}
                <div className='mb-2'>
                    <label htmlFor='Description'>Description:</label>
                    <input
                        type='text'
                        name='Description'
                        placeholder='Enter Description'
                        className='form-control w-full'
                        value={formData.Description}
                        onChange={handleChange}
                    />
                </div>
                {/* Amount */}
                <div className='mb-2'>
                    <label htmlFor='Amount'>Amount:</label>
                    <input
                        type='number'
                        name='Amount'
                        placeholder='Enter Amount'
                        className='form-control w-full'
                        value={formData.Amount}
                        onChange={handleChange}
                    />
                </div>
                {/* Payment Status */}
<div className='mb-2'>
    <label htmlFor='Payment_Status'>Payment Status:</label>
    <select
        name='Payment_Status'
        className='form-control w-full'
        value={formData.Payment_Status}
        onChange={handleChange}
    >
        <option value=''>Select Payment Status</option>
        <option value='Pending'>Pending</option>
        <option value='Paid'>Paid</option>
        <option value='Failed'>Failed</option>
        {/* Add more options as needed */}
    </select>
</div>

                <div className='flex justify-end'>
                    <button
                        className='bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                        onClick={handleValidation}
                    >
                        Submit
                    </button>
                    <button
                        className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 ml-2 rounded'
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateBill;
