import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreatePatient() {

    
    const [patient_Fname, setPatient_Fname] = useState('');
    const [patient_Lname, setPatient_Lname] = useState('');
    const [blood_type, setBlood_type] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [conditionn, setConditionn] = useState('');
    const [admission_Date, setAdmission_Date] = useState('');
    const [discharge_Date, setDischarge_Date] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();


    const handleAddPatient = async () => {
        try {
    
            await axios.post("http://localhost:9004/api/patient/create", {
                Patient_Fname: patient_Fname,
                Patient_Lname: patient_Lname,
                Blood_type: blood_type,
                Email: email,
                Gender: gender,
                Conditionn: conditionn,
                Admission_Date: admission_Date,
                Discharge_Date: discharge_Date,
                Phone: phone,
            });
            setPatient_Fname('');
            setPatient_Lname('');
            setBlood_type('');
            setEmail('');
            setGender('');
            setConditionn('');
            setAdmission_Date('');
            setDischarge_Date('');
            setPhone('');

            navigate('/dashboard/patient', { replace: true });
            
            window.location.reload();

        } catch (error) {
            console.error('Error adding Patient:', error);
        }
    };


    return (
        <div className='container mt-4'>
            <div className='bg-white rounded p-3'>
                <div className='mb-2'>
                    <label htmlFor="patient_Fname">First name:  </label>
                    <input type='text' id="patient_Fname" placeholder='Enter Firstname' className='form-control'
                        value={patient_Fname} onChange={e => setPatient_Fname(e.target.value)} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="patient_Lname">Last name:  </label>
                    <input type='text' id="patient_Lname" placeholder='Enter Lastname' className='form-control'
                        value={patient_Lname} onChange={e => setPatient_Lname(e.target.value)} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="blood_type">Blood Type:  </label>
                    <input type='text' id="blood_type" placeholder='Enter Blood type' className='form-control'
                        value={blood_type} onChange={e => setBlood_type(e.target.value)} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="email">Email: </label>
                    <input type='email' id="email" placeholder='Enter email' className='form-control'
                        value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="gender">Gender:  </label>
                    <input type='text' id="gender" placeholder='Enter Gender' className='form-control'
                        value={gender} onChange={e => setGender(e.target.value)} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="conditionn">Condition:  </label>
                    <input type='text' id="conditionn" placeholder='Enter Conditionn' className='form-control'
                        value={conditionn} onChange={e => setConditionn(e.target.value)} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="admission_Date">Admission Date:  </label>
                    <input type='date' id="admission_Date" placeholder='Enter Admission Date' className='form-control'
                        value={admission_Date} onChange={e => setAdmission_Date(e.target.value)} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="discharge_Date">Discharge Date:  </label>
                    <input type='date' id="discharge_Date" placeholder='Enter Discharge Date' className='form-control'
                        value={discharge_Date} onChange={e => setDischarge_Date(e.target.value)} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="phone">Phone:  </label>
                    <input type='text' id="phone" placeholder='Enter Phone' className='form-control'
                        value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <button type="button" className='btn btn-success' onClick={handleAddPatient }>Submit</button>
            </div>
        </div>
    );
}

export default CreatePatient;
