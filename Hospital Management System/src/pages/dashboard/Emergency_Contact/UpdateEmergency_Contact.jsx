import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UpdateEmergency_Contact({id}) {


    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [relation, setrelation] = useState('');
    const [patientID, setpatientID] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [originalData, setOriginalData] = useState({});
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
               
                const response = await axios.get(`http://localhost:9004/api/emergency_contact/${id}`);
                const data = response.data;
                setOriginalData(data);
                setName(response.data.Contact_Name);
                setPhone(response.data.Phone);
                setrelation(response.data.Relation);
                setpatientID(response.data.Patient_ID);
            } catch (error) {
                console.error('Error fetching emergency_contact:', error);
            }
        };

        fetchData();
    }, []);


    const handleUpdateMedicine = async () => {
        
        try {

            if (!name.trim()) {
                setAlertMessage("Emergency Contact name cannot be empty.");
                return;
            }
            if (
                name === originalData.Contact_Name &&
                phone === originalData.Phone &&
                relation === originalData.Relation &&
                patientID === originalData.Patient_ID
            ) {
                setAlertMessage("Data must be changed before updating.");
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


            await axios.put(`http://localhost:9004/api/emergency_contact/update/${id}`, { 
                
            Contact_Name: name,
            Phone: phone,
            Relation: relation,
            Patient_ID: patientID,
            
            });
            setName(name);
            setPhone(phone);
            setrelation(relation);
            setpatientID(patientID);
            navigate('/dashboard/emergency_contact');
            window.location.reload();
        } catch (error) {
            console.error('Error updating emergency_contact:', error);
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
                <button type="button" className='btn btn-success' onClick={handleUpdateMedicine}>Submit</button>
            </div>
        </div>
    );

}

export default UpdateEmergency_Contact;