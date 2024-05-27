import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';




function CreatePatient({ onClose }) {
    const [formData, setFormData] = useState({
        Personal_Number: '',
        Patient_Fname: '',
        Patient_Lname: '',
        Birth_Date: '',
        Blood_type: '',
        Email: '',
        Gender: '',
        Conditionn: '',
        Admission_Date: '',
        Discharge_Date: '',
        Phone: ''
    });

    const [patients, setPatients] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get('token');

    
    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/patient', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddPatient = async () => {
        try {
            const response = await axios.post('http://localhost:9004/api/patient/create', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data);
            navigate('/dashboard/patient');
            window.location.reload();
        } catch (error) {
            console.error('Error adding Patient:', error.response ? error.response.data : error.message);
            setAlertMessage('Error adding patient. Please try again.');
            setShowErrorModal(true);
        }
    };

    const handleValidation = () => {
        const { Personal_Number, Patient_Fname, Patient_Lname, Birth_Date, Blood_type, Email, Gender, Conditionn, Admission_Date, Discharge_Date, Phone } = formData;
        const personalNumberRegex = /^\d{10}$/;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^(?:\+\d{1,2}\s?)?(?:\d{3})(?:\d{6})$/;
        const bloodTypeRegex = /^(A|B|AB|O)[+-]$/;

        if (Personal_Number === '' || Patient_Fname === '' || Patient_Lname === '' || Birth_Date === '' || Blood_type === '' || Email === '' || Gender === '' || Conditionn === '' || Admission_Date === '' || Discharge_Date === '' || Phone === '') {
            showAlert('All fields are required.');
            return;
        }

        if (!Personal_Number.match(personalNumberRegex)) {
            showAlert('Please enter a valid personal number');
            return;
        }

        if (!Blood_type.match(bloodTypeRegex)) {
            showAlert('Please enter a valid blood type (e.g., A+, B-, AB+, O-).');
            return;
        }

        if (!Email.match(emailRegex)) {
            showAlert('Please enter a valid email address.');
            return;
        }

        if (!Phone.match(phoneRegex)) {
            showAlert('Please enter a valid phone number (like: 044111222)');
            return;
        }

        const existingPatient = patients.find(patient => patient.Patient_Fname === Patient_Fname);
        if (existingPatient) {
            showAlert('Patient with the same name already exists');
            return;
        }

        handleAddPatient();
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <div className="bg-white p-8 mx-auto rounded-lg w-96">
                {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}
                <h1 className="text-lg font-bold mb-4">Add Patient</h1>
                <div className='mb-4'>
                    <label htmlFor="Personal_Number">Personal Number: </label>
                    <input type='text' id="Personal_Number" name="Personal_Number" placeholder='Enter Personal Number' className='form-control'
                        value={formData.Personal_Number} onChange={handleChange} />
                </div>
                <div className='mb-4'>
                    <label htmlFor="Patient_Fname">First name: </label>
                    <input type='text' id="Patient_Fname" name="Patient_Fname" placeholder='Enter Firstname' className='form-control'
                        value={formData.Patient_Fname} onChange={handleChange} />
                </div>
                <div className='mb-4'>
                    <label htmlFor="Patient_Lname">Last name: </label>
                    <input type='text' id="Patient_Lname" name="Patient_Lname" placeholder='Enter Lastname' className='form-control'
                        value={formData.Patient_Lname} onChange={handleChange} />
                </div>
                <div className='mb-4'>
                    <label htmlFor="Birth_Date">Birth date: </label>
                    <input type='date' id="Birth_Date" name="Birth_Date" placeholder='Enter Birth Date' className='form-control'
                        value={formData.Birth_Date} onChange={handleChange} />
                </div>
                <div className='mb-4'>
                    <label htmlFor="Gender">Gender: </label>
                    <select id="Gender" name="Gender" className='form-control' value={formData.Gender} onChange={handleChange}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                </div>
                <div className='mb-4'>
                    <label htmlFor="Blood_type">Blood Type: </label>
                    <select id="Blood_type" name="Blood_type" className='form-control' value={formData.Blood_type} onChange={handleChange}>
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
                    <label htmlFor="Conditionn">Condition: </label>
                    <input type='text' id="Conditionn" name="Conditionn" placeholder='Enter Condition' className='form-control'
                        value={formData.Conditionn} onChange={handleChange} />
                </div>
                <div className='mb-4'>
                    <label htmlFor="Admission_Date">Admission Date: </label>
                    <input type='date' id="Admission_Date" name="Admission_Date" placeholder='Enter Admission Date' className='form-control'
                        value={formData.Admission_Date} onChange={handleChange} />
                </div>
                <div className='mb-4'>
                    <label htmlFor="Discharge_Date">Discharge Date: </label>
                    <input type='date' id="Discharge_Date" name="Discharge_Date" placeholder='Enter Discharge Date' className='form-control'
                        value={formData.Discharge_Date} onChange={handleChange} />
                </div>
                <div className='mb-4'>
                    <label htmlFor="Email">Email: </label>
                    <input type='email' id="Email" name="Email" placeholder='Enter email' className='form-control'
                        value={formData.Email} onChange={handleChange} />
                </div>
                <div className='mb-4'>
                    <label htmlFor="Phone">Phone: </label>
                    <input type='text' id="Phone" name="Phone" placeholder='Enter Phone' className='form-control'
                        value={formData.Phone} onChange={handleChange} />
                </div>
                <div className="flex justify-end">
                    <button
                        className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleValidation}
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

export default CreatePatient;
