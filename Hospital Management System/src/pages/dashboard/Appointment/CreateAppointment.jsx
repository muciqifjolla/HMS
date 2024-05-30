import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie'; 

function CreateAppointment({ onClose }) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Doctor_ID: '',
        Date: '',
        Time: '',
        Scheduled_On: '',
    });
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [staff, setStaff] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const token = Cookies.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPatients();
        fetchDoctors();
        fetchStaff();
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
            const response = await axios.get('http://localhost:9004/api/doctors', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const fetchStaff = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/staff', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setStaff(response.data);
        } catch (error) {
            console.error('Error fetching staff:', error);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/appointment', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddAppointment = async () => {
        try {
            await axios.post('http://localhost:9004/api/appointment/create', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/dashboard/appointments');
            window.location.reload();
        } catch (error) {
            console.error('Error adding appointment:', error);
            showAlert('Error adding appointment. Please try again.');
        }
    };

    const handleValidation = async () => {
        const { Patient_ID, Doctor_ID, Date, Time, Scheduled_On } = formData;

        if (Patient_ID === '' || Doctor_ID === '' || Date === '' || Time === '' || Scheduled_On === '') {
            showAlert('All fields are required.');
            return;
        }

        if (!Date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            showAlert('Please enter a valid date (YYYY-MM-DD).');
            return;
        }

        if (!Time.match(/^\d{2}:\d{2}$/)) {
            showAlert('Please enter a valid time (HH:MM).');
            return;
        }

        try {
            // Proceed with form submission
            await handleAddAppointment();
        } catch (error) {
            console.error('Error adding appointment:', error);
            showAlert('Error adding appointment. Please try again.');
        }
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
        setTimeout(() => {
            setShowErrorModal(false);
        }, 3000);
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50'>
            <div className='bg-white p-8 mx-auto rounded-lg w-96'>
                {showErrorModal && (
                    <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
                )}
                <h1 className='text-lg font-bold mb-4'>Add Appointment</h1>

                <div className='mb-2'>
                    <label htmlFor='Patient_ID'>Patient:</label>
                    <select
                        id='Patient_ID'
                        name='Patient_ID'
                        className='form-control'
                        value={formData.Patient_ID}
                        onChange={handleChange}
                    >
                        <option value=''>Select</option>
                        {patients.map(patient => (
                            <option key={patient.Patient_ID} value={patient.Patient_ID}>
                                {`${patient.Patient_Fname} ${patient.Patient_Lname}`}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='mb-2'>
                    <label htmlFor='Doctor_ID'>Doctor:</label>
                    <select
                        id='Doctor_ID'
                        name='Doctor_ID'
                        className='form-control'
                        value={formData.Doctor_ID}
                        onChange={handleChange}
                    >
                        <option value=''>Select</option>
                        {doctors.map(doctor => {
                            const staffMember = staff.find(staff => staff.Emp_ID === doctor.Emp_ID);
                            return (
                                <option key={doctor.Doctor_ID} value={doctor.Doctor_ID}>
                                    {staffMember ? `${staffMember.Emp_Fname} ${staffMember.Emp_Lname}` : 'Unknown'}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div className='mb-2'>
                    <label htmlFor='Date'>Date:</label>
                    <input
                        type='date'
                        id='Date'
                        name='Date'
                        className='form-control'
                        value={formData.Date}
                        onChange={handleChange}
                    />
                </div>

                <div className='mb-2'>
                    <label htmlFor='Time'>Time:</label>
                    <input
                        type='time'
                        id='Time'
                        name='Time'
                        className='form-control'
                        value={formData.Time}
                        onChange={handleChange}
                    />
                </div>

                <div className='mb-2'>
                    <label htmlFor='Scheduled_On'>Scheduled On:</label>
                    <input
                        type='datetime-local'
                        id='Scheduled_On'
                        name='Scheduled_On'
                        className='form-control'
                        value={formData.Scheduled_On}
                        onChange={handleChange}
                    />
                </div>

                <div className='flex justify-end'>
                    <button
                        className='bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
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

export default CreateAppointment;

