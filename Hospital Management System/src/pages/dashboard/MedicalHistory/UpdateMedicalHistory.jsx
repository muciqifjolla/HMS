import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';

function UpdateMedicalHistory({ id }) {
    const [patient_ID, setPatient_ID] = useState('');
    const [allergies, setAllergies] = useState('');
    const [pre_Conditions, setPre_Conditions] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/medicalhistory/${id}`);
                setOriginalData(response.data);
                setPatient_ID(response.data.Patient_ID);
                setAllergies(response.data.Allergies);
                setPre_Conditions(response.data.Pre_Conditions);
            } catch (error) {
                console.error('Error fetching medical history:', error);
            }
        };
    
        fetchData();
    }, [id]);

    const handleUpdateMedicalHistory = async () => {
        try {
            if (!patient_ID.trim() || !allergies.trim() || !pre_Conditions.trim()) {
                setAlertMessage('All fields are required.');
                setShowErrorModal(true);
                return;
            }

            if (
                patient_ID === originalData.Patient_ID &&
                allergies === originalData.Allergies &&
                pre_Conditions === originalData.Pre_Conditions
            ) {
                setAlertMessage("Data must be changed before updating.");
                setShowErrorModal(true);
                return;
            }

            await axios.put(`http://localhost:9004/api/medicalhistory/update/${id}`, {
                Patient_ID: patient_ID,
                Allergies: allergies,
                Pre_Conditions: pre_Conditions
            });

            navigate('/dashboard/medicalhistory');
            window.location.reload();
        } catch (error) {
            console.error('Error updating medical history:', error);
        }
    };

    const closeErrorModal = () => {
        setShowErrorModal(false);
    };
    
    return (
        <div className='container mt-4'>
            {showErrorModal && <ErrorModal message={alertMessage} onClose={closeErrorModal} />}
            <div className='bg-white rounded p-3'>
                <div className='mb-2'>
                    <label htmlFor="patient_ID">Patient ID: </label>
                    <input type='text' id="patient_ID" placeholder='Enter Patient ID' className='form-control'
                        value={patient_ID} onChange={e => setPatient_ID(e.target.value)} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="allergies">Allergies: </label>
                    <input type='text' id="allergies" placeholder='Enter Allergies' className='form-control'
                        value={allergies} onChange={e => setAllergies(e.target.value)} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="pre_conditions">Pre-Conditions: </label>
                    <input type='text' id="pre_conditions" placeholder='Enter Pre-Conditions' className='form-control'
                        value={pre_Conditions} onChange={e => setPre_Conditions(e.target.value)} />
                </div>
                <button type="button" className='btn btn-success' onClick={handleUpdateMedicalHistory}>Submit</button>
            </div>
        </div>
    );
}

export default UpdateMedicalHistory;
