import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ErrorModal from '../../../components/ErrorModal';

function UpdateNurse({ id }) {
    const [patientID, setPatientID] = useState('');
    const [empID, setEmpID] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();
    const [originalData, setOriginalData] = useState({}); // Initialize originalData as an empty object

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/nurse/${id}`);
                const data = response.data; 
                setOriginalData(data); // Update originalData using setOriginalData
                setPatientID(data.Patient_ID);
                setEmpID(data.Emp_ID);
            } catch (error) {
                console.error('Error fetching nurse:', error);
                setAlertMessage('Error fetching nurse details.');
                setShowErrorModal(true);
            }
        };
    
        fetchData();
    }, [id]);

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    const handleUpdateNurse = async () => {
        if (patientID === '' || empID === '') {
            showAlert('All fields are required');
            return;
        }
    
        if (
            parseInt(patientID) === parseInt(originalData.Patient_ID) &&
            parseInt(empID) === parseInt(originalData.Emp_ID)
        ) {
            showAlert("Data must be changed before updating.");
            return;
        }
    
        try {
            await axios.get(`http://localhost:9004/api/patient/check/${patientID}`);
        } catch (error) {
            console.error('Error checking patient ID:', error);
            showAlert('Patient ID does not exist');
            return;
        }

        try {
            await axios.get(`http://localhost:9004/api/staff/check/${empID}`);
        } catch (error) {
            console.error('Error checking staff ID:', error);
            showAlert('Staff ID does not exist');
            return;
        } 

        try {
            await axios.put(`http://localhost:9004/api/nurse/update/${id}`, {
                Patient_ID: patientID,
                Emp_ID: empID,
            });

            navigate('/dashboard/nurse'); 
        } catch (error) {
            console.error('Error updating nurse:', error);
            showAlert('Error updating nurse. Please try again.');
        }
    };

    return (
        <div className="container mt-4">
            {showErrorModal && (
                <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
            )}
            <div className="bg-white rounded p-3">
                <div className="mb-2">
                    <label htmlFor="patientID">Patient ID:</label>
                    <input
                        type='number'
                        id='patientID'
                        name='patientID'
                        placeholder='Enter Patient ID'
                        className='form-control'
                        value={patientID}
                        onChange={(e) => setPatientID(e.target.value)}
                    />
                </div>

                <div className="mb-2">
                    <label htmlFor="empID">Employee ID:</label>
                    <input
                        type='number'
                        id='empID'
                        name='empID'
                        placeholder='Enter Employee ID'
                        className='form-control'
                        value={empID}
                        onChange={(e) => setEmpID(e.target.value)}
                    />
                </div>

                <button type="button" className="btn btn-success" onClick={handleUpdateNurse}>Submit</button>
            </div>
        </div>
    );
}

export default UpdateNurse;
