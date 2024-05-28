import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';

function CreateVisit({ onClose }) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Doctor_ID: '',
        date_of_visit: '',
        condition: '',
        diagnosis: '',
        therapy: '',
    });
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        fetchPatients();
        fetchDoctors();
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

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/doctor', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddVisit = async () => {
        try {
            await axios.post('http://localhost:9004/api/visit/create', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/dashboard/visit');
            window.location.reload();
        } catch (error) {
            console.error('Error adding visit:', error);
            setAlertMessage('Error adding visit. Please try again.');
            setShowErrorModal(true);
        }
    };

    const handleValidation = async () => {
        const { Patient_ID, Doctor_ID, date_of_visit, condition, diagnosis, therapy } = formData;

        if (Patient_ID === '' || Doctor_ID === '' || date_of_visit === '' || condition === '' || diagnosis === '' || therapy === '') {
            showAlert('All fields are required');
            return;
        }
        if (parseInt(Patient_ID) < 1 || parseInt(Doctor_ID) < 1) {
            showAlert('Patient ID and Doctor ID cannot be less than 1');
            return;
        }

        handleAddVisit();
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <div className="bg-white p-8 mx-auto rounded-lg w-96">
                {showErrorModal && (
                    <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
                )}
                <h1 className="text-lg font-bold mb-4">Add Visit</h1>
                <div className='mb-4'>
                    <label htmlFor='visitPatientID'>Patient:</label>
                    <select
                        id='visitPatientID'
                        name='Patient_ID'
                        className='form-control'
                        value={formData.Patient_ID}
                        onChange={handleChange}
                    >
                        <option value=''>Select Patient</option>
                        {patients.map(patient => (
                            <option key={patient.Patient_ID} value={patient.Patient_ID}>
                                {`${patient.Patient_Fname} ${patient.Patient_Lname}`}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='mb-4'>
                    <label htmlFor='visitDoctorID'>Doctor:</label>
                    <select
                        id='visitDoctorID'
                        name='Doctor_ID'
                        className='form-control'
                        value={formData.Doctor_ID}
                        onChange={handleChange}
                    >
                        <option value=''>Select Doctor</option>
                        {doctors.map(doctor => (
                            <option key={doctor.Doctor_ID} value={doctor.Doctor_ID}>
                                {`${doctor.Staff.Emp_Fname} ${doctor.Staff.Emp_Lname}`}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='mb-4'>
                    <label htmlFor='dateOfVisit'>Date of Visit:</label>
                    <input
                        type='date'
                        id='dateOfVisit'
                        name='date_of_visit'
                        className='form-control'
                        value={formData.date_of_visit}
                        onChange={handleChange}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor='condition'>Condition:</label>
                    <input
                        type='text'
                        id='condition'
                        name='condition'
                        placeholder='Enter Condition'
                        className='form-control'
                        value={formData.condition}
                        onChange={handleChange}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor='diagnosis'>Diagnosis:</label>
                    <input
                        type='text'
                        id='diagnosis'
                        name='diagnosis'
                        placeholder='Enter Diagnosis'
                        className='form-control'
                        value={formData.diagnosis}
                        onChange={handleChange}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor='therapy'>Therapy:</label>
                    <input
                        type='text'
                        id='therapy'
                        name='therapy'
                        placeholder='Enter Therapy'
                        className='form-control'
                        value={formData.therapy}
                        onChange={handleChange}
                    />
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

export default CreateVisit;
