import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';

function CreatePatient() {
    const [formData, setFormData] = useState({
        Patient_Fname: '',
        Patient_Lname: '',
        Blood_type: '',
        Email: '',
        Gender: '',
        Conditionn: '',
        Admission_Date: '',
        Discharge_Date: '',
        Phone: ''
    });

    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false); // Add state for showing/hiding the error modal
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddPatient = async () => {
        try {
            const response = await axios.post('http://localhost:9004/api/patient/create', formData);
            console.log(response.data);
            // Handle success response
            navigate('/dashboard/patient');
            window.location.reload();
        } catch (error) {
            console.error('Error adding Patient:', error);
            // Handle error response
            setAlertMessage('Error adding patient. Please try again.');
            setShowErrorModal(true); // Show the error modal
            setTimeout(() => {
                setAlertMessage('');
                setShowErrorModal(false); // Hide the error modal after 3 seconds
            }, 3000);
        }
    };

    const handleValidation = () => {
        const { Patient_Fname, Patient_Lname, Blood_type, Email, Gender, Conditionn, Admission_Date, Discharge_Date, Phone } = formData;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^(?:\+\d{1,2}\s?)?(?:\d{3})(?:\d{6})$/;
        const bloodTypeRegex = /^(A|B|AB|O)[+-]$/;
    
        if (Patient_Fname === '' || Patient_Lname === '' || Blood_type === '' || Email === '' || Gender === '' || Conditionn === '' || Admission_Date === '' || Discharge_Date === '' || Phone === '') {
            showAlert('All fields are required.');
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
    
        // If all validations pass, submit the form
        handleAddPatient();
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true); // Show the error modal without timeout
    };
    

    return (
        <div className='container mt-4'>
            {showErrorModal && <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />}
            <div className='bg-white rounded p-3'>
                <div className='mb-2'>
                    <label htmlFor="patient_Fname">First name:  </label>
                    <input type='text' id="patient_Fname" name="Patient_Fname" placeholder='Enter Firstname' className='form-control'
                        value={formData.Patient_Fname} onChange={handleChange} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="patient_Lname">Last name:  </label>
                    <input type='text' id="patient_Lname" name="Patient_Lname" placeholder='Enter Lastname' className='form-control'
                        value={formData.Patient_Lname} onChange={handleChange} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="blood_type">Blood Type:  </label>
                    <select id="blood_type" name="Blood_type" className='form-control' value={formData.Blood_type} onChange={handleChange}>
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
                <div className='mb-2'>
                    <label htmlFor="email">Email: </label>
                    <input type='email' id="email" name="Email" placeholder='Enter email' className='form-control'
                        value={formData.Email} onChange={handleChange} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="gender">Gender:  </label>
                    <select id="gender" name="Gender" className='form-control' value={formData.Gender} onChange={handleChange}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                </div>
                <div className='mb-2'>
                    <label htmlFor="conditionn">Condition:  </label>
                    <input type='text' id="conditionn" name="Conditionn" placeholder='Enter Conditionn' className='form-control'
                        value={formData.Conditionn} onChange={handleChange} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="admission_Date">Admission Date:  </label>
                    <input type='date' id="admission_Date" name="Admission_Date" placeholder='Enter Admission Date' className='form-control'
                        value={formData.Admission_Date} onChange={handleChange} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="discharge_Date">Discharge Date:  </label>
                    <input type='date' id="discharge_Date" name="Discharge_Date" placeholder='Enter Discharge Date' className='form-control'
                        value={formData.Discharge_Date} onChange={handleChange} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="phone">Phone:  </label>
                    <input type='text' id="phone" name="Phone" placeholder='Enter Phone' className='form-control'
                        value={formData.Phone} onChange={handleChange} />
                </div>
                <button type="button" className='btn btn-success' onClick={handleValidation}>Submit</button>
            </div>
        </div>
    );
}

export default CreatePatient;
