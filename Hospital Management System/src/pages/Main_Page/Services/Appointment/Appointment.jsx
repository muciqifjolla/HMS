import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../../Header';
import Patient from './Patient';

function Appointment() {
    const [appointments, setAppointments] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showPatient, setShowPatient] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

    const handleUpdateButtonClick = (appointmentId) => {
        setSelectedAppointmentId(appointmentId);
        setShowUpdateForm(!showUpdateForm);
    };

    function calculateDaysLeft(targetDate) {
        const currentDate = new Date();
        const target = new Date(targetDate);
        const differenceMs = target - currentDate;
        const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
        return differenceDays;
    }

    useEffect(() => {
        axios.get('http://localhost:9004/api/appointment')
            .then(res => setAppointments(res.data))
            .catch(err => console.log(err));
    }, []);

    function formatDate(dateString) {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:9004/api/appointment/delete/${id}`);
            setAppointments(appointments.filter(item => item.Appoint_ID !== id));
        } catch (err) {
            console.log(err);
        }
    };

    if (showPatient) {
        return <Patient showCreateForm={showCreateForm} setShowCreateForm={setShowCreateForm} showUpdateForm={showUpdateForm} setShowUpdateForm={setShowUpdateForm} setSelectedPatientId={setSelectedAppointmentId} />;
    }

    return (
        <>
            <Header />
            <div className='container-fluid mt-4'>
                <div className="flex justify-between items-center mb-4">
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300 ease-in-out"
                        onClick={() => setShowCreateForm(!showCreateForm)}
                    >
                        {showCreateForm ? 'Close Add Form' : 'Add Appointment'}
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300 ease-in-out ml-4"
                        onClick={() => setShowPatient(true)}
                    >
                        Go to Patients
                    </button>
                </div>
                <div className="table-responsive">
                    <div className="py-8">
                        <div>
                            <h2 className="text-2xl font-semibold leading-tight">Appointments</h2>
                        </div>
                        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                            <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                                <table className="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Patient Name / Doctor</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Scheduled On / Date</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Appointment / Date</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Time</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.map((data, i) => (
                                            <tr key={i}>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <div className="flex">
                                                        <div className="ml-3">
                                                            <p className="text-gray-900 whitespace-no-wrap">
                                                                Patient: <span className="underline">{data.patient_full_name}</span>
                                                            </p>
                                                            <p className="text-gray-600 whitespace-no-wrap">Doctor <span className='underline'>{data.doctor_full_name}</span></p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{formatDate(data.Scheduled_On)}</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{formatDate(data.Date)}</p>
                                                    <p className="text-gray-600 whitespace-no-wrap">Due in {calculateDaysLeft(data.Date)} days</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{data.Time} Time</p>
                                                </td>
                                                <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                                                    <button className='bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => handleDelete(data.Appoint_ID)} style={{ borderRadius: '0.5rem', padding: '5px 10px' }}>Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Appointment;
