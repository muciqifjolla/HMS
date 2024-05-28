import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie';

function UpdateVisit({id, onClose }) {
    const [patientID, setPatientID] = useState('');
    const [doctorID, setDoctorID] = useState('');
    const [dateOfVisit, setDateOfVisit] = useState('');
    const [condition, setCondition] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [therapy, setTherapy] = useState('');
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/visit/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const visitData = response.data;
                setOriginalData(visitData);
                setPatientID(visitData.Patient_ID);
                setDoctorID(visitData.Doctor_ID);
                setDateOfVisit(visitData.date_of_visit);
                setCondition(visitData.condition);
                setDiagnosis(visitData.diagnosis);
                setTherapy(visitData.therapy);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.error('Unauthorized access - perhaps the token is invalid or expired');
                    setAlertMessage('Invalid or expired authentication token. Please log in again.');
                } else {
                    console.error('Error fetching visit:', error);
                    setAlertMessage('Error fetching visit details.');
                }
                setShowErrorModal(true);
            }
        };

        fetchData();
        fetchPatients();
        fetchDoctors();
    }, [id, token]);

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

    const handleUpdateVisit = async () => {
        if (patientID === '' || doctorID === '' || dateOfVisit === '' || condition === '' || diagnosis === '' || therapy === '') {
            showAlert('All fields are required');
            return;
        }

        if (
            parseInt(patientID) === parseInt(originalData.Patient_ID) &&
            parseInt(doctorID) === parseInt(originalData.Doctor_ID) &&
            dateOfVisit === originalData.date_of_visit &&
            condition === originalData.condition &&
            diagnosis === originalData.diagnosis &&
            therapy === originalData.therapy
        ) {
            setAlertMessage("Data must be changed before updating.");
            setShowErrorModal(true);
            return;
        }

        if (parseInt(patientID) < 1 || parseInt(doctorID) < 1) {
            showAlert("Patient ID and Doctor ID must be at least 1.");
            return;
        }

        try {
            await axios.put(`http://localhost:9004/api/visit/update/${id}`, {
                Patient_ID: patientID,
                Doctor_ID: doctorID,
                date_of_visit: dateOfVisit,
                condition: condition,
                diagnosis: diagnosis,
                therapy: therapy
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            navigate('/dashboard/visit');
            window.location.reload();
        } catch (error) {
            console.error('Error updating visit:', error);
            setAlertMessage('Error updating visit.');
            setShowErrorModal(true);
        }
    };

    const closeErrorModal = () => {
        setShowErrorModal(false);
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <div className="bg-white p-8 mx-auto rounded-lg w-96">
                {showErrorModal && <ErrorModal message={alertMessage} onClose={closeErrorModal} />}
                <h1 className="text-lg font-bold mb-4">Update Visit</h1>
                <div className='mb-4'>
                    <label htmlFor="visitPatientID">Patient:</label>
                    <select
                        id="visitPatientID"
                        name="Patient_ID"
                        className="form-control"
                        value={patientID}
                        onChange={e => setPatientID(e.target.value)}
                    >
                        <option value="">Select Patient</option>
                        {patients.map(patient => (
                            <option key={patient.Patient_ID} value={patient.Patient_ID}>
                                {`${patient.Patient_Fname} ${patient.Patient_Lname}`}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='mb-4'>
                    <label htmlFor="visitDoctorID">Doctor:</label>
                    <select
                        id="visitDoctorID"
                        name="Doctor_ID"
                        className="form-control"
                        value={doctorID}
                        onChange={e => setDoctorID(e.target.value)}
                    >
                        <option value="">Select Doctor</option>
                        {doctors.map(doctor => (
                            <option key={doctor.Doctor_ID} value={doctor.Doctor_ID}>
                                {`${doctor.Staff.Emp_Fname} ${doctor.Staff.Emp_Lname}`}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="dateOfVisit">Date of Visit:</label>
                    <input
                        type="date"
                        id="dateOfVisit"
                        name="date_of_visit"
                        className="form-control"
                        value={dateOfVisit}
                        onChange={e => setDateOfVisit(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="condition">Condition:</label>
                    <input
                        type="text"
                        id="condition"
                        name="condition"
                        placeholder="Enter Condition"
                        className="form-control"
                        value={condition}
                        onChange={e => setCondition(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="diagnosis">Diagnosis:</label>
                    <input
                        type="text"
                        id="diagnosis"
                        name="diagnosis"
                        placeholder="Enter Diagnosis"
                        className="form-control"
                        value={diagnosis}
                        onChange={e => setDiagnosis(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="therapy">Therapy:</label>
                    <input
                        type="text"
                        id="therapy"
                        name="therapy"
                        placeholder="Enter Therapy"
                        className="form-control"
                        value={therapy}
                        onChange={e => setTherapy(e.target.value)}
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleUpdateVisit}
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

export default UpdateVisit;
