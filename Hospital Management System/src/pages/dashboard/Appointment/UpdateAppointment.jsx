import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';

function UpdateAppointment({ id, onClose }) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Doctor_ID: '',
        Date: '',
        Time: '',
        Scheduled_On: '',
    });
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [staff, setStaff] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const token = Cookies.get('token');

    useEffect(() => {
        fetchAppointmentDetails();
        fetchPatients();
        fetchDoctors();
        fetchStaff();
    }, [id]);

    const fetchAppointmentDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:9004/api/appointment/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = response.data;
            setFormData(data);
        } catch (error) {
            console.error('Error fetching appointment details:', error);
            showAlert('Error fetching appointment details.');
        }
    };

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleUpdateAppointment = async () => {
        const { Patient_ID, Doctor_ID, Date, Time, Scheduled_On } = formData;

        if (!Patient_ID || !Doctor_ID || !Date || !Time || !Scheduled_On) {
            showAlert('All fields are required.');
            return;
        }

        try {
            await axios.put(`http://localhost:9004/api/appointment/update/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            onClose(); // Close the modal after updating
            window.location.reload(); // Reload the page
        } catch (error) {
            console.error('Error updating appointment:', error);
            showAlert('Error updating appointment.');
        }
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    const closeErrorModal = () => {
        setShowErrorModal(false);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <div className="bg-white p-8 mx-auto rounded-lg w-96">
                {showErrorModal && <ErrorModal message={alertMessage} onClose={closeErrorModal} />}
                <h1 className="text-lg font-bold mb-4">Update Appointment</h1>
                
                <div className='mb-2'>
                <label htmlFor='Patient_ID'>Patient Name:</label>
                    <input
                        type='text'
                        name='Patient_ID'
                        placeholder='Enter Patient Name'
                        className='form-control w-full'
                        value={`${patients.find(patient => patient.Patient_ID === formData.Patient_ID)?.Patient_Fname} ${patients.find(patient => patient.Patient_ID === formData.Patient_ID)?.Patient_Lname}`}
                        readOnly
                    />
                </div>

                <div className='mb-2'>
    <label htmlFor='Doctor_ID'>Doctor Name:</label>
    <input
        type='text'
        name='Doctor_ID'
        placeholder='Enter Doctor Name'
        className='form-control w-full'
        value={`${staff.find(staffMember => staffMember.Emp_ID === formData.Doctor_ID)?.Emp_Fname} ${staff.find(staffMember => staffMember.Emp_ID === formData.Doctor_ID)?.Emp_Lname}`}
        readOnly
    />
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

                <div className="flex justify-end">
                    <button type="button" className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleUpdateAppointment}>
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

export default UpdateAppointment;
