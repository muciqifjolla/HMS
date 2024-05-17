import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateAppointment({onClose}) {

    
    const [scheduled_On, setScheduled_On] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [doctor, setDoctor] = useState('');
    const [patient, setPatient] = useState('');
    const navigate = useNavigate();


    const handleAddAppointment = async () => {
        try {
            const timeWithSeconds = time + ':00';
    
            await axios.post("http://localhost:9004/api/appointment/create", {
                Scheduled_On: scheduled_On,
                Date: date,
                Time: timeWithSeconds,
                Doctor_ID: doctor,
                Patient_ID: patient,
            });
            setScheduled_On('');
            setDate('');
            setTime('');
            setDoctor('');
            setPatient('');
            navigate('/homepage/services/appointment');
            window.location.reload();
        } catch (error) {
            console.error('Error adding Appointment:', error);
        }
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
    <div className="bg-white p-8 mx-auto rounded-lg w-96">
        {/* Add any error modal component here if needed */}
        <h1 className="text-lg font-bold mb-4">Add Appointment</h1>
        <div className='mb-4'>
            <label htmlFor='Scheduled_On'>Scheduled:</label>
            <input
                type='date'
                id='Scheduled_On'
                name='Scheduled_On'
                placeholder='Enter Scheduled_On'
                className='form-control w-full'
                value={scheduled_On}
                onChange={e => setScheduled_On(e.target.value)}
            />
        </div>
        <div className='mb-4'>
            <label htmlFor='date'>Date Appointment:</label>
            <input
                type='date'
                id='date'
                name='date'
                placeholder='Enter date'
                className='form-control w-full'
                value={date}
                onChange={e => setDate(e.target.value)}
            />
        </div>
        <div className='mb-4'>
            <label htmlFor='time'>Time of Appointment:</label>
            <input
                type='time'
                id='time'
                name='time'
                placeholder='Enter time'
                className='form-control w-full'
                value={time}
                onChange={e => setTime(e.target.value)}
            />
        </div>
        <div className='mb-4'>
            <label htmlFor='doctor'>Doctor Name:</label>
            <input
                type='text'
                id='doctor'
                name='doctor'
                placeholder='Enter Doctor Name'
                className='form-control w-full'
                value={doctor}
                onChange={e => setDoctor(e.target.value)}
            />
        </div>
        <div className='mb-4'>
            <label htmlFor='patient'>Patient Name:</label>
            <input
                type='text'
                id='patient'
                name='patient'
                placeholder='Enter Patient Name'
                className='form-control w-full'
                value={patient}
                onChange={e => setPatient(e.target.value)}
            />
        </div>
        <div className="flex justify-end">
            <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={handleAddAppointment}
            >
                Submit
            </button>
            {/* You might want to handle the close button functionality */}
            <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
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
