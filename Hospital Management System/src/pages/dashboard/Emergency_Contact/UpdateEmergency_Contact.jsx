import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal'; // Assuming this component exists for handling error messages

function UpdateEmergency_Contact({ id }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [relation, setRelation] = useState('');
    const [patientID, setPatientID] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/emergency_contact/${id}`);
                const data = response.data;
                setOriginalData(data);
                setName(data.Contact_Name);
                setPhone(data.Phone);
                setRelation(data.Relation);
                setPatientID(data.Patient_ID);
            } catch (error) {
                console.error('Error fetching emergency contact:', error);
                setAlertMessage('Error fetching emergency contact details.');
                setShowErrorModal(true);
            }
        };

        fetchData();
    }, [id]);

    const handleUpdateContact = async () => {
        const phoneRegex = /^(?:\+\d{1,2}\s?)?(?:\d{3})(?:\d{6})$/;

        if (!name.trim()) {
            setAlertMessage("Emergency contact name cannot be empty.");
            setShowErrorModal(true);
            return;
        }

        if (!phone.trim() || !phone.match(phoneRegex)) {
            setAlertMessage("Please enter a valid phone number.");
            setShowErrorModal(true);
            return;
        }

        if (!relation.trim()) {
            setAlertMessage("Relation cannot be empty.");
            setShowErrorModal(true);
            return;
        }

        if (!patientID || patientID < 1) {
            setAlertMessage("Invalid Patient ID.");
            setShowErrorModal(true);
            return;
        }

        if (
            name === originalData.Contact_Name &&
            phone === originalData.Phone &&
            relation === originalData.Relation &&
            patientID === originalData.Patient_ID
        ) {
            setAlertMessage("Data must be changed before updating.");
            setShowErrorModal(true);
            return;
        }

        try {
            await axios.put(`http://localhost:9004/api/emergency_contact/update/${id}`, {
                Contact_Name: name,
                Phone: phone,
                Relation: relation,
                Patient_ID: patientID,
            });

            navigate('/dashboard/emergency_contact');
            window.location.reload();
        } catch (error) {
            console.error('Error updating emergency contact:', error);
            setAlertMessage('Error updating emergency contact.');
            setShowErrorModal(true);
        }
    };

    const closeErrorModal = () => {
        setShowErrorModal(false);
    };

    return (
        <div className="container mt-4">
            {showErrorModal && <ErrorModal message={alertMessage} onClose={closeErrorModal} />}
            <div className="bg-white rounded p-3">
                <div className="mb-2">
                    <label htmlFor="emergencyName">Emergency Contact Name:</label>
                    <input
                        type="text"
                        id="emergencyName"
                        placeholder="Enter Name"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-2">
                    <label htmlFor="emergencyPhone">Emergency Contact Phone:</label>
                    <input
                        type="text"
                        id="emergencyPhone"
                        placeholder="Enter Phone"
                        className="form-control"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <div className='mb-2'>
          <label htmlFor='Relation'>Relation:</label>
          <select
            id='Relation'
            name='Relation'
            className='form-control'
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
          >
            <option value=''>Select Relation</option>
            <option value='Mother'>Mother</option>
            <option value='Father'>Father</option>
            <option value='Sister'>Sister</option>
            <option value='Brother'>Brother</option>
            <option value='Close family Member'>Close Family Member</option>
            <option value='Friend'>Friend</option>
          </select>
        </div>
                <div className="mb-2">
                    <label htmlFor="emergencyPatientID">Patient ID:</label>
                    <input
                        type="number"
                        id="emergencyPatientID"
                        placeholder="Enter Patient ID"
                        className="form-control"
                        value={patientID}
                        onChange={(e) => setPatientID(e.target.value)}
                    />
                </div>
                <button type="button" className="btn btn-success" onClick={handleUpdateContact}>
                    Submit
                </button>
            </div>
        </div>
    );
}

export default UpdateEmergency_Contact;
