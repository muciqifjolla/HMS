import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateEmergency_Contact() {

    
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [relation, setrelation] = useState('');
    const [patientID, setpatientID] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();


    const handleAddEmergency_Contact = async () => {
        try {
            if (!name.trim()) {
                setAlertMessage("Emergency Contact name cannot be empty.");
                return;
            }

            if (name.length < 5) {
                setAlertMessage("Emergency Contact name must be at least 5 characters long.");
                return;
            }

            if (!phone) {
                setAlertMessage("Phone is required.");
                return;
            }

            if (!relation) {
                setAlertMessage("Relation is required.");
                return;
            }

            if (patientID <1) {
                setAlertMessage("Patient ID must be at least 1.");
                return;
            }

            setAlertMessage(''); 

            await axios.post("http://localhost:9004/api/emergency_contact/create",  {
                Contact_Name: name,
                Phone: phone,
                Relation: relation,
                Patient_ID: patientID,
            });
            setName('');
            setPhone('');
            setrelation('');
            setpatientID('');
            navigate('/dashboard/emergency_contact');
            window.location.reload();
        } catch (error) {
            console.error('Error adding emergency_contact:', error);
        }
    };


    return (
        <div className='container mt-4'>


{alertMessage && (
                <div className='alert alert-warning'>
                    {alertMessage}
                </div>
            )}
            <div className='bg-white rounded p-3'>
                <div className='mb-2'>
                    <label htmlFor="emergencyName">Emergency Contact Name: </label>
                    <input type='text' id="emergencyName" placeholder='Enter Name' className='form-control'
                        value={name} onChange={e => setName(e.target.value)} />
                </div>

                <div className='mb-2'>
                    <label htmlFor="emergencyPhone">Emergency Contact Phone: </label>
                    <input type='number' id="medicineQuantity" placeholder='Enter Phone' className='form-control'
                        value={phone} onChange={e => setPhone(e.target.value)} />
                </div>

                <div className='mb-2'>
                    <label htmlFor="emergencyRelation">Emergency Contact Relation: </label>
                    <input type='text' id="medicineCost" placeholder='Enter Relation' className='form-control'
                        value={relation} onChange={e => setrelation(e.target.value)} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="emergencyPatientID">Patient ID: </label>
                    <input type='number' id="emergencyPatientID" placeholder='Enter Patient ID' className='form-control'
                        value={patientID} onChange={e => setpatientID(e.target.value)} />
                </div>
                <button type="button" className='btn btn-success' onClick={handleAddEmergency_Contact}>Submit</button>
            </div>


        </div>
    );
}

export default CreateEmergency_Contact;
