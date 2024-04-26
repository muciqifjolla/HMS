import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';

function UpdatePatient({ id }) {
    const [patient_Fname, setPatient_Fname] = useState('');
    const [patient_Lname, setPatient_Lname] = useState('');
    const [blood_type, setBlood_type] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [conditionn, setConditionn] = useState('');
    const [admission_Date, setAdmission_Date] = useState('');
    const [discharge_Date, setDischarge_Date] = useState('');
    const [phone, setPhone] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false); // Add state for showing/hiding the error modal
    const [originalData, setOriginalData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/patient/${id}`);
                const formattedAdmission_Date = new Date(response.data.Admission_Date).toISOString().split('T')[0];
                const formattedDischarge_Date = new Date(response.data.Discharge_Date).toISOString().split('T')[0];
                setOriginalData(response.data);
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
    }, [id]);

    const handleUpdatePatient = async () => {
        try {
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const phoneRegex = /^(?:\+\d{1,2}\s?)?(?:\d{3})(?:\d{6})$/;
            const bloodTypeRegex = /^(A|B|AB|O)[+-]$/;

            if (!patient_Fname.trim() || !patient_Lname.trim() || !blood_type.trim() || !email.trim() || !gender.trim() || !conditionn.trim() || !admission_Date.trim() || !discharge_Date.trim() || !phone.trim()) {
                setAlertMessage('All fields are required.');
                setShowErrorModal(true);
                return;
            }
            if (
                patient_Fname === originalData.Patient_Fname &&
                patient_Lname === originalData.Patient_Lname &&
                blood_type === originalData.Blood_type &&
                email === originalData.Email&&
                gender === originalData.Gender&&
                conditionn === originalData.Conditionn&&
                admission_Date === originalData.Admission_Date&&
                discharge_Date === originalData.Discharge_Date&&
                phone === originalData.Phone
            ) {
                setAlertMessage("Data must be changed before updating.");
                setShowErrorModal(true);
                return;
            }

            if (!blood_type.match(bloodTypeRegex)) {
                setAlertMessage('Please enter a valid blood type (e.g., A+, B-, AB+, O-).');
                setShowErrorModal(true);
                return;
            }

            if (!email.match(emailRegex)) {
                setAlertMessage('Please enter a valid email address.');
                setShowErrorModal(true);
                return;
            }

            if (!phone.match(phoneRegex)) {
                setAlertMessage('Please enter a valid phone number (like: 044111222).');
                setShowErrorModal(true);
                return;
            }
            
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

            navigate('/dashboard/patient');
            window.location.reload();
        } catch (error) {
            console.error('Error updating patient:', error);
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
    </div>
    );

}

export default UpdatePatient;
