import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ErrorModal from '../../../components/ErrorModal'; 

function UpdateMedicalHistory({ id, onClose }) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Allergies: '',
        Pre_Conditions: '',
    
    });
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const token = sessionStorage.getItem('token'); // Retrieve the token from localStorage


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/medicalhistory/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
                );
                const data = response.data;
                setFormData(data);
            } catch (error) {
                console.error('Error fetching medicalhistory:', error);
                showAlert('Error fetching medicalhistory details.');
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

    const handleUpdateMedicalHistory = async () => {
        try {
            await axios.put(`http://localhost:9004/api/medicalhistory/update/${id}`, formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            );
            onClose(); // Close the modal after updating
            window.location.reload(); // Reload the page
        } catch (error) {
            console.error('Error updating medicalhistory:', error);
            showAlert('Error updating medicalhistory.');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <div className="bg-white p-8 mx-auto rounded-lg w-96">
                {showErrorModal && (
                    <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
                )}
                <h1 className="text-lg font-bold mb-4">Update Medical History</h1>
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
                 {/* Allergies */}
                 <div className='mb-2'>
                    <label htmlFor='Allergies'>Allergies:</label>
                    <input
                        type='text'
                        name='Allergies'
                        placeholder='Enter Allergies'
                        className='form-control w-full'
                        value={formData.Allergies}
                        onChange={handleChange}
                    />
                </div>
                {/* Pre Conditions */}
                <div className='mb-2'>
                    <label htmlFor='Pre_Conditions'>Pre Conditions:</label>
                    <input
                        type='text'
                        name='Pre_Conditions'
                        placeholder='Enter Pre Conditions'
                        className='form-control w-full'
                        value={formData.Pre_Conditions}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex justify-end">
                    <button type="button" className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleUpdateMedicalHistory}>
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

export default UpdateMedicalHistory;
