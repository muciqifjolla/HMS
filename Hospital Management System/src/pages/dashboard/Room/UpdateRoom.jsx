import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';

function UpdateRoom({ id }) {
    const [roomType, setRoomType] = useState('');
    const [patientID, setPatientID] = useState('');
    const [cost, setCost] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/room/${id}`);
                const responseData = response.data; 
                setOriginalData(responseData);
                setRoomType(responseData.Room_type);
                setPatientID(responseData.Patient_ID);
                setCost(responseData.Room_cost);
            } catch (error) {
                console.error('Error fetching room:', error);
                setAlertMessage('Error fetching room details.');
                setShowErrorModal(true);
            }
        };
    
        fetchData();
    }, [id]);

    const handleUpdateRoom = async () => {
        if (roomType ==='' || patientID ==='' || cost === '') {
            showAlert('All fields are required');
            setShowErrorModal(true);
            return;
        }
    
        if (
            roomType === originalData.Room_type &&
            parseInt(patientID) === parseInt(originalData.Patient_ID) &&
            parseInt(cost) === parseInt(originalData.Room_cost)
        ) {
            setAlertMessage("Data must be changed before updating.");
            setShowErrorModal(true);
            return;
        }
    
        if (parseInt(patientID) < 1) {
            showAlert("Patient ID must be at least 1.");
            return;
        }
    
        if (!isValidDecimal(cost)) {
            showAlert('Cost must be a valid decimal (10.2)');
            return;
        }
  
        try {
            // Check if patient ID exists
            await axios.get(`http://localhost:9004/api/patient/check/${patientID}`);
        } catch (error) {
            console.error('Error checking patient ID:', error);
            showAlert('Patient ID does not exist');
            return;
        }

        try {
            await axios.put(`http://localhost:9004/api/room/update/${id}`, {
                Room_type: roomType,
                Patient_ID: patientID,
                Room_cost: cost,
            });

            navigate('/dashboard/room'); 
            window.location.reload();
        } catch (error) {
            console.error('Error updating room:', error);
            setAlertMessage('Error updating room.');
            setShowErrorModal(true);
        }
    };

    const isValidDecimal = (value) => {
        const decimalRegex = /^\d{0,8}(\.\d{1,2})?$/;
        return decimalRegex.test(value);
    };
    
    const closeErrorModal = () => {
        setShowErrorModal(false);
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };
    
    return (
        <div className="container mt-4">
            {showErrorModal && (
                <ErrorModal message={alertMessage} onClose={() => closeErrorModal(false)} />
            )}
            <div className="bg-white rounded p-3">
                <div className="mb-2">
                    <label htmlFor="roomType">Room Type:</label>
                    <input
                        type='text'
                        id='roomType'
                        name='Room_type'
                        placeholder='Enter Room Type'
                        className='form-control'
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                    />
                </div>

                <div className="mb-2">
                    <label htmlFor="roomPatientID">Patient ID:</label>
                    <input
                        type='number'
                        id='roomPatientID'
                        name='Patient_ID '
                        placeholder='Enter Patient ID'
                        className='form-control'
                        value={patientID}
                        onChange={(e) => setPatientID(e.target.value)}
                    />
                </div>

                <div className="mb-2">
                    <label htmlFor="roomCost">Cost (in €):</label>
                    <input
                        type='number'
                        id='roomCost'
                        name='Room_cost'
                        placeholder='Enter Cost'
                        className='form-control'
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                    />
                </div>

                <button type="button" className="btn btn-success" onClick={handleUpdateRoom}>Submit</button>
            </div>
        </div>
    );
}

export default UpdateRoom;
