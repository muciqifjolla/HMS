import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';

function CreateMedicalHistory() {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Allergies: '',
        Pre_Conditions: ''
    });

    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false); // Add state for showing/hiding the error modal
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddMedicalHistory = async () => {
        try {
            const response = await axios.post('http://localhost:9004/api/medicalhistory/create', formData);
            console.log(response.data);
            navigate('/dashboard/medicalhistorys');
            window.location.reload();
        } catch (error) {
            console.error('Error adding Medical History:', error);
            setAlertMessage('Error adding medical history. Please try again.');
            setShowErrorModal(true); 
        }
    };

    const handleValidation = () => {
        const { Patient_ID, Allergies, Pre_Conditions } = formData;

        if (Patient_ID === '') {
            showAlert('Patient ID is required.');
            return;
        }

        if (!/^[0-9]+$/.test(Patient_ID)) {
            showAlert('Patient ID should contain only numbers.');
            return;
        }

        if (Allergies === '') {
            showAlert('Allergies is required.');
            return;
        }

        if (Pre_Conditions === '') {
            showAlert('Pre-Conditions is required.');
            return;
        }

        // Add additional custom validations for allergies and pre-conditions here if needed

        handleAddMedicalHistory();
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true); 
    };
    

    return (
        <div className='container mt-4'>
            {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}
            <div className='bg-white rounded p-3'>
                <div className='mb-2'>
                    <label htmlFor="patient_ID">Patient ID:  </label>
                    <input type='text' id="patient_ID" name="Patient_ID" placeholder='Enter Patient ID' className='form-control'
                        value={formData.Patient_ID} onChange={handleChange} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="allergies">Allergies:  </label>
                    <input type='text' id="allergies" name="Allergies" placeholder='Enter Allergies' className='form-control'
                        value={formData.Allergies} onChange={handleChange} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="pre_conditions">Pre-Conditions:  </label>
                    <input type='text' id="pre_conditions" name="Pre_Conditions" placeholder='Enter Pre-Conditions' className='form-control'
                        value={formData.Pre_Conditions} onChange={handleChange} />
                </div>
                <button type="button" className='btn btn-success' onClick={handleValidation}>Submit</button>
            </div>
        </div>
    );
}

export default CreateMedicalHistory;
