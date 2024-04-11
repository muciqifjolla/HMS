import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Appointment({ showCreateForm, setShowCreateForm,showUpdateForm, setShowUpdateForm, setSelectedAppointmentIdId}) {
    
    const [appointment, setAppointment] = useState([]);


    const handleUpdateButtonClick = (appointmentId) => {
        setSelectedAppointmentIdId(appointmentId);
        setShowUpdateForm(!showUpdateForm);
    };
    function calculateDaysLeft(targetDate) {
        // Get the current date
        const currentDate = new Date();
    
        // Parse the target date string to a Date object
        const target = new Date(targetDate);
    
        // Calculate the difference in milliseconds
        const differenceMs = target - currentDate;
    
        // Convert milliseconds to days
        const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
    
        return differenceDays;
    }
    

    useEffect(() => {
        axios.get('http://localhost:9004/api/appointment')
            .then(res => setAppointment(res.data))
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
            setAppointment(appointment.filter(item => item.Appoint_ID !== id));
        } catch (err) {
            console.log(err);
        }
    }



    return (
    <div className='container-fluid mt-4'>
        <h2 className="my-3">Appointment</h2>
        <button className='btn btn-success mb-3' style={{ borderRadius: '0.5rem' }} onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Close Add Form' : 'Add +'}
        </button>
        <div className="table-responsive">
            <div className="container mx-auto px-4 sm:px-8">
                <div className="py-8">
                    <div>
                        <h2 className="text-2xl font-semibold leading-tight">Appointments</h2>
                    </div>
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div
                            className="inline-block min-w-full shadow-md rounded-lg overflow-hidden"
                        >
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                    <th
                                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                    >
                                        Patient Name / Doctor
                                    </th>
                                    <th
                                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                    >
                                        Scheduled On / Date
                                    </th>
                                    <th
                                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                    >
                                        Appointment / Date
                                    </th>
                                    <th
                                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                    >
                                        Time
                                    </th>
                                    <th
                                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                    >
                                        Update
                                    </th>
                                    <th
                                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                    >
                                        Delete
                                    </th>
                                    
                                    </tr>
                                </thead>
                                <tbody>
                                {appointment.map((data, i) => (
                                    <tr>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <div className="flex">
                                            <div className="ml-3">
                                                <p className="text-gray-900 whitespace-no-wrap">
                                                    {data.Patient_ID} Patient ID
                                                </p>
                                                <p className="text-gray-600 whitespace-no-wrap">{data.Doctor_ID} Doctor Id</p>
                                            </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{formatDate(data.Scheduled_On)}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{formatDate(data.Date)}</p>
                                            <p className="text-gray-600 whitespace-no-wrap">Due in {calculateDaysLeft(formatDate(data.Date))} days</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-gray-900 whitespace-no-wrap">{data.Time} Time</p>
                                        </td>
                                        <td>
                                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"  onClick={() => handleUpdateButtonClick(data.Appoint_ID)}>
                                                {showUpdateForm ? 'Close Update Form' : 'Update'}
                                            </button>
                                        </td>
                                    
                                        <td>
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
    </div>
    );
}

export default Appointment;
