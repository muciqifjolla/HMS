import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';

function UpdateBill({ id, onClose }) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Amount: '',
        Payment_Status: '',
        Description: '',
        Date_Issued: ''
    });
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const [patients, setPatients] = useState([]);
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/bills/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = response.data;
                setFormData(data);
                setOriginalData(data);
            } catch (error) {
                console.error('Error fetching bill:', error);
                showAlert('Error fetching bill details.');
            }
        };

        fetchData();
    }, [id, token]);

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

    const handleUpdateBill = async () => {
        try {
            const { Amount, Payment_Status, Description, Date_Issued } = formData;

            if (!Amount.trim() || !Payment_Status.trim() || !Description.trim() || !Date_Issued.trim()) {
                showAlert('All fields are required.');
                return;
            }

            if (
                Amount === originalData.Amount &&
                Payment_Status === originalData.Payment_Status &&
                Description === originalData.Description &&
                Date_Issued === originalData.Date_Issued
            ) {
                showAlert("Data must be changed before updating.");
                return;
            }

            await axios.put(`http://localhost:9004/api/bills/update/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error updating bill:', error);
            showAlert('Error updating bill.');
        }
    };

    const closeErrorModal = () => {
        setShowErrorModal(false);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <div className="bg-white p-8 mx-auto rounded-lg w-96">
                {showErrorModal && <ErrorModal message={alertMessage} onClose={closeErrorModal} />}
                <h1 className="text-lg font-bold mb-4">Update Bill</h1>
                <div className='mb-2'>
                    <label htmlFor='Patient_ID'>Patient Name:</label>
                    <input
                        type='text'
                        name='Patient_ID'
                        placeholder='Enter Patient Name'
                        className='form-control w-full'
                        value={`${patients.find(patient => patient.Patient_ID === formData.Patient_ID)?.Patient_Fname} ${patients.find(patient => patient.Patient_ID === formData.Patient_ID)?.Patient_Lname}`}
                        readOnly
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='Amount'>Amount:</label>
                    <input
                        type='text'
                        name='Amount'
                        placeholder='Enter Amount'
                        className='form-control w-full'
                        value={formData.Amount}
                        onChange={handleChange}
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor='Payment_Status'>Payment Status:</label>
                    <select
                        name='Payment_Status'
                        className='form-control w-full'
                        value={formData.Payment_Status}
                        onChange={handleChange}
                    >
                        <option value=''>Select Payment Status</option>
                        <option value='Paid'>Pending</option>
                        <option value='Pending'>Paid</option>
                        <option value='Overdue'>Failed</option>
                        {/* Add more options if needed */}
                    </select>
                </div>
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
                <div className="flex justify-end">
                    <button type="button" className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleUpdateBill}>
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

export default UpdateBill;
