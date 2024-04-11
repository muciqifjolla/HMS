import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateAppointment() {

    
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
            navigate('/dashboard/appointments');
        } catch (error) {
            console.error('Error adding Appointment:', error);
        }
    };


    return (
        <div className='container mt-4'>
            <div className='bg-white rounded p-3'>
                <div className='mb-2'>
                    <label htmlFor="Scheduled_On">Scheduled</label>
                    <input type='date' id="Scheduled_On" placeholder='Enter Scheduled_On' className='form-control'
                        value={scheduled_On} onChange={e => setScheduled_On(e.target.value)} />
                </div>

                <div className='mb-2'>
                    <label htmlFor="date">Date Appointment: </label>
                    <input type='date' id="date" placeholder='Enter date' className='form-control'
                        value={date} onChange={e => setDate(e.target.value)} />
                </div>

                <div className='mb-2'>
                    <label htmlFor="time">Time of Appointment</label>
                    <input type='time' id="time" placeholder='Enter time' className='form-control'
                        value={time} onChange={e => setTime(e.target.value)} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="doctor">Doctor Name </label>
                    <input type='number' id="doctor" placeholder='Enter doctor' className='form-control'
                        value={doctor} onChange={e => setDoctor(e.target.value)} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="patient">Patient Name</label>
                    <input type='number' id="patient" placeholder='Enter Patient' className='form-control'
                        value={patient} onChange={e => setPatient(e.target.value)} />
                </div>
                <button type="button" className='btn btn-success' onClick={handleAddAppointment }>Submit</button>
            </div>
        </div>
    );
}

export default CreateAppointment;
