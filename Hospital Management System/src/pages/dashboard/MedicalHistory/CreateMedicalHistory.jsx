import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';

function CreateMedicalHistory({onClose}) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Allergies: '',
        Pre_Conditions: '',
    });
    const [medicalHistory, setMedicalHistory] = useState([]);
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
    useEffect(() => {
        // Fetch existing medicines when component mounts
        fetchMedicalHistory();
    }, []);

    const fetchMedicalHistory = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/medicalhistory');
            setMedicalHistory(response.data);
        } catch (error) {
            console.error('Error fetching Medical History:', error);
        }
    };

    const handleAddMedicalHistory = async () => {
        try {
            await axios.post("http://localhost:9004/api/medicalhistory/create", formData);
            navigate('/dashboard/medicalhistory');
            window.location.reload(); // Refresh after successful addition
        } catch (error) {
            console.error('Error adding MedicalHistory:', error);
            showAlert('Error adding MedicalHistory. Please try again.');
        }
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
        // Automatically hide the error modal after 3 seconds
    };

    const handleValidation = async () => {
        const {
            Patient_ID,
            Allergies,
            Pre_Conditions,
        } = formData;
    
        if (Patient_ID === '' || Allergies === '' || Pre_Conditions === '' ) {
            showAlert('All fields are required!');
            return;
        }
    
        if (Patient_ID < 1) {
            showAlert('Patient ID can not be less than 1');
            return;
        }
    
    
        try {
            await axios.get(`http://localhost:9004/api/patient/check/${Patient_ID}`);
            // Proceed with form submission after successful validation
            handleAddMedicalHistory();
        } catch (error) {
            console.error('Error checking patient ID:', error);
            showAlert('Patient ID does not exist');
        }
       
    };
    

    return (
        <div className='fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50'>
            <div className='bg-white p-8 mx-auto rounded-lg w-96'>
                {showErrorModal && (
                    <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
                )}
                <h1 className='text-lg font-bold mb-4'>Add MedicalHistory</h1>
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

export default CreateMedicalHistory;
