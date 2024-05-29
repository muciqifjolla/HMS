import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';

function UpdatePatient({ id, onClose }) {
    const [personalNumber, setPersonalNumber] = useState('');
    const [patientFname, setPatientFname] = useState('');
    const [patientLname, setPatientLname] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [bloodType, setBloodType] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [phone, setPhone] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const [patient, setPatient] = useState([]);
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/patient/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setOriginalData(response.data);
                setPersonalNumber(response.data.Personal_Number);
                setPatientFname(response.data.Patient_Fname);
                setPatientLname(response.data.Patient_Lname);
                setBirthDate(response.data.Birth_Date);
                setBloodType(response.data.Blood_type);
                setEmail(response.data.Email);
                setGender(response.data.Gender);
                setPhone(response.data.Phone);
            } catch (error) {
                console.error('Error fetching patient:', error);
            }
        };

        fetchData();
    }, [id, token]);

    useEffect(() => {
        const fetchAllPatients = async () => {
            try {
                const response = await axios.get('http://localhost:9004/api/patient', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setPatient(response.data);
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };

        fetchAllPatients();
    }, [token]);

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

            if (!patientFname.trim() || !patientLname.trim() || !bloodType.trim() || !email.trim() || !gender.trim() || !phone.trim()) {
                showAlert('All fields are required.');
                return;
            }
            if (
                personalNumber === originalData.Personal_Number &&
                patientFname === originalData.Patient_Fname &&
                patientLname === originalData.Patient_Lname &&
                birthDate === originalData.Birth_Date &&
                bloodType === originalData.Blood_type &&
                email === originalData.Email &&
                gender === originalData.Gender &&
                phone === originalData.Phone
            ) {
                showAlert("Data must be changed before updating.");
                return;
            }

            if (!String(personalNumber).match(personalNumberRegex)) {
                showAlert('Please enter a valid personal number');
                return;
            }

            if (!bloodType.match(bloodTypeRegex)) {
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
            const existingPatient = patient.find(pat => pat.Personal_Number === personalNumber && pat.Patient_ID !== id);
            if (existingPatient) {
                showAlert('Patient with the same personal number already exists.');
                return;
            }

            await axios.put(`http://localhost:9004/api/patient/update/${id}`, {
                Personal_Number: personalNumber,
                Patient_Fname: patientFname,
                Patient_Lname: patientLname,
                Birth_Date: birthDate,
                Blood_type: bloodType,
                Email: email,
                Gender: gender,
                Phone: phone,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
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
                        type='text' id="personal_Number" placeholder='Enter Personal Number' className='form-control'value={personalNumber} 
                        onChange={e => setPersonalNumber(e.target.value)} 
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor="patient_Fname">First name: </label>
                    <input type='text' id="patient_Fname" placeholder='Enter Firstname' className='form-control'
                        value={patientFname} onChange={e => setPatientFname(e.target.value)} />
                </div>
                <div className='mb-4'>
                    <label htmlFor="patient_Lname">Last name: </label>
                    <input type='text' id="patient_Lname" placeholder='Enter Lastname' className='form-control'
                        value={patientLname} onChange={e => setPatientLname(e.target.value)} />
                </div>
                <div className='mb-4'>
                    <label htmlFor="birth_Date">Birth Date: </label>
                    <input type='date' id="birth_Date" placeholder='Enter Birth Date' className='form-control'
                        value={birthDate} onChange={e => setBirthDate(e.target.value)} />
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
                    <select id="blood_type" className='form-control' value={bloodType} onChange={e => setBloodType(e.target.value)}>
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
