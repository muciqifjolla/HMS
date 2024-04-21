import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UpdatePatient({id}) {

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

    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/patient/${id}`);
                const formattedAdmission_Date= new Date(response.data.Admission_Date).toISOString().split('T')[0];
                const formattedDischarge_Date = new Date(response.data.Discharge_Date).toISOString().split('T')[0];
                setPatient_Fname(response.data.Patient_Fname);
                setPatient_Lname(response.data.Patient_Lname);
                setBlood_type(response.data.Blood_type);
                setEmail(response.data.Email);
                setGender(response.data.Gender);
                setConditionn(response.data.Conditionn);
                setAdmission_Date(formattedAdmission_Date);
                setDischarge_Date(formattedDischarge_Date);
                setPhone(response.data.Phone);
            } catch (error) {
                console.error('Error fetching patient:', error);
            }
        };

        fetchData();
    }, []);


    const handleUpdatePatient = async () => {
        
        try {

            await axios.put(`http://localhost:9004/api/patient/update/${id}`, {  

            
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
           setPatient_Fname(patient_Fname);
           setPatient_Lname(patient_Lname);
           setBlood_type(blood_type);
           setEmail(email);
           setGender(gender);
           setConditionn(conditionn);
           setAdmission_Date(admission_Date);
           setDischarge_Date(discharge_Date);
           setPhone(phone);

           navigate('/dashboard/patient', { replace: true });
            
            window.location.reload();
        } catch (error) {
            console.error('Error updating patient:', error);
        }
    };

    
    return (
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
                    <label htmlFor="email">Email:  </label>
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
            <button type="button" className='btn btn-success' onClick={handleUpdatePatient}>Submit</button>
        </div>
    
    );

}

export default UpdatePatient;
