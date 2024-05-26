import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';

function UpdatePatient({ id, onClose }) {
    const [personal_Number, setPersonal_Number] = useState('');
    const [patient_Fname, setPatient_Fname] = useState('');
    const [patient_Lname, setPatient_Lname] = useState('');
    const [birth_Date, setBirth_Date] = useState('');
    const [blood_type, setBlood_type] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [conditionn, setConditionn] = useState('');
    const [admission_Date, setAdmission_Date] = useState('');
    const [discharge_Date, setDischarge_Date] = useState('');
    const [phone, setPhone] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const [patient, setPatient] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/patient/${id}`);
                const formattedAdmission_Date = new Date(response.data.Admission_Date).toISOString().split('T')[0];
                const formattedDischarge_Date = new Date(response.data.Discharge_Date).toISOString().split('T')[0];
                setOriginalData(response.data);
                setPersonal_Number(response.data.Personal_Number);
                setPatient_Fname(response.data.Patient_Fname);
                setPatient_Lname(response.data.Patient_Lname);
                setBirth_Date(response.data.Birth_Date);
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

    useEffect(() => {
        const fetchAllPatients = async () => {
            try {
                const response = await axios.get('http://localhost:9004/api/patient');
                setPatient(response.data);
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };

        fetchAllPatients();
    }, []);

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    const handleUpdatePatient = async () => {
        try {
            const personalNumberRegex = /^\d{10}$/;
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const phoneRegex = /^(?:\+\d{1,2}\s?)?(?:\d{3})(?:\d{6})$/;
            const bloodTypeRegex = /^(A|B|AB|O)[+-]$/;
    
            if (!patient_Fname.trim() || !patient_Lname.trim() || !blood_type.trim() || !email.trim() || !gender.trim() || !conditionn.trim() || !admission_Date.trim() || !discharge_Date.trim() || !phone.trim()) {
                showAlert('All fields are required.');
                return;
            }
            if (
                personal_Number === originalData.Personal_Number &&
                patient_Fname === originalData.Patient_Fname &&
                patient_Lname === originalData.Patient_Lname &&
                birth_Date === originalData.Birth_Date &&
                blood_type === originalData.Blood_type &&
                email === originalData.Email &&
                gender === originalData.Gender &&
                conditionn === originalData.Conditionn &&
                admission_Date === originalData.Admission_Date &&
                discharge_Date === originalData.Discharge_Date &&
                phone === originalData.Phone
            ) {
                showAlert("Data must be changed before updating.");
                return;
            }
    
            if (!String(personal_Number).match(personalNumberRegex)) {
                showAlert('Please enter a valid personal number');
                return;
            }
    
            if (!blood_type.match(bloodTypeRegex)) {
                showAlert('Please enter a valid blood type (e.g., A+, B-, AB+, O-).');
                return;
            }
    
            if (!email.match(emailRegex)) {
                showAlert('Please enter a valid email address.');
                return;
            }
    
            if (!phone.match(phoneRegex)) {
                showAlert('Please enter a valid phone number (like: 044111222).');
                return;
            }
    
            // Check if patient with the same personal number already exists
            const existingPatient = patient.find(pat => pat.Personal_Number === personal_Number && pat.Patient_ID !== id);
            if (existingPatient) {
                showAlert('Patient with the same personal number already exists.');
                return;
            }
    
            await axios.put(`http://localhost:9004/api/patient/update/${id}`, {
                Personal_Number: personal_Number,
                Patient_Fname: patient_Fname,
                Patient_Lname: patient_Lname,
                Birth_Date: birth_Date,
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
            showAlert('An error occurred while updating the patient. Please try again later.');
        }
    };
    

    const closeErrorModal = () => {
        setShowErrorModal(false);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <div className="bg-white p-8 mx-auto rounded-lg w-96">
                {showErrorModal && <ErrorModal message={alertMessage} onClose={closeErrorModal} />}
                <h1 className="text-lg font-bold mb-4">Update Patient</h1>
                <div className='mb-4'>
                    <label htmlFor="personal_Number">Personal Number: </label>
                    <input 
                        type='text' id="personal_Number" placeholder='Enter Personal Number' className='form-control'value={personal_Number} 
                        onChange={e => setPersonal_Number(e.target.value)} 
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor="patient_Fname">First name: </label>
                    <input type='text' id="patient_Fname" placeholder='Enter Firstname' className='form-control'
                        value={patient_Fname} onChange={e => setPatient_Fname(e.target.value)} />
                </div>
                <div className='mb-4'>
                    <label htmlFor="patient_Lname">Last name: </label>
                    <input type='text' id="patient_Lname" placeholder='Enter Lastname' className='form-control'
                        value={patient_Lname} onChange={e => setPatient_Lname(e.target.value)} />
                </div>
                <div className='mb-4'>
                    <label htmlFor="birth_Date">Birth Date: </label>
                    <input type='date' id="birth_Date" placeholder='Enter Birth Date' className='form-control'
                        value={birth_Date} onChange={e => setBirth_Date(e.target.value)} />
                </div>
                <div className='mb-4'>
                    <label htmlFor="gender">Gender: </label>
                    <select id="gender" className='form-control' value={gender} onChange={e => setGender(e.target.value)}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                </div>
                <div className='mb-4'>
                    <label htmlFor="blood_type">Blood Type: </label>
                    <select id="blood_type" className='form-control' value={blood_type} onChange={e => setBlood_type(e.target.value)}>
                        <option value="">Select Blood Type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                </div>
                <div className='mb-4'>
                    <label htmlFor="conditionn">Condition: </label>
                    <input type='text' id="conditionn" placeholder='Enter Condition' className='form-control'
                        value={conditionn} onChange={e => setConditionn(e.target.value)} />
                </div>
                <div className='mb-4'>
                    <label htmlFor="admission_Date">Admission Date: </label>
                    <input type='date' id="admission_Date" placeholder='Enter Admission Date' className='form-control'
                        value={admission_Date} onChange={e => setAdmission_Date(e.target.value)} />
                </div>
                <div className='mb-4'>
                    <label htmlFor="discharge_Date">Discharge Date: </label>
                    <input type='date' id="discharge_Date" placeholder='Enter Discharge Date' className='form-control'
                        value={discharge_Date} onChange={e => setDischarge_Date(e.target.value)} />
                </div>
                <div className='mb-4'>
                    <label htmlFor="email">Email: </label>
                    <input type='email' id="email" placeholder='Enter email' className='form-control'
                        value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className='mb-4'>
                    <label htmlFor="phone">Phone: </label>
                    <input type='text' id="phone" placeholder='Enter Phone' className='form-control'
                        value={phone} onChange={e => setPhone(e.target.value)} />
                </div>

                <div className="flex justify-end">
                    <button
                        className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleUpdatePatient}
                    >
                        Submit
                    </button>
                    <button
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 ml-2 rounded"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UpdatePatient;
