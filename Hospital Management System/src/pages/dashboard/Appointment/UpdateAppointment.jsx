import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UpdateAppointment({id}) {


    const navigate = useNavigate();
    const [scheduled_On, setScheduled_On] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [doctor, setDoctor] = useState('');
    const [patient, setPatient] = useState('');

    console.log(scheduled_On);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/appointment/${id}`);
                const formattedScheduledOn = new Date(response.data.Scheduled_On).toISOString().split('T')[0];
                const formattedDate = new Date(response.data.Date).toISOString().split('T')[0];
                setScheduled_On(formattedScheduledOn);
                setDate(formattedDate);
                setTime(response.data.Time);
                setDoctor(response.data.Doctor_ID);
                setPatient(response.data.Patient_ID);
            } catch (error) {
                console.error('Error fetching appointment:', error);
            }
        };

        fetchData();
    }, []);


    const handleUpdateAppointment = async () => {
        
        try {
            const timeWithSeconds = time + ':00';

            await axios.put(`http://localhost:9004/api/appointment/update/${id}`, {  Scheduled_On: scheduled_On,
            Date: date,
            Time: timeWithSeconds,
            Doctor_ID: doctor,
            Patient_ID: patient});
            setScheduled_On(scheduled_On);
            setDate(date);
            setTime(timeWithSeconds);
            setDoctor(doctor);
            setPatient(patient);

           
            navigate('/dashboard/home');
        } catch (error) {
            console.error('Error updating appointment:', error);
        }
    };

    
    return (
        <div className='bg-white rounded p-3'>
            <div className='mb-2'>
                <label htmlFor="scheduled_On">Scheduled On: </label>
                <input type='date' id="scheduled_On" placeholder='Enter Name' className='form-control'
                    value={scheduled_On} onChange={e => setScheduled_On(e.target.value)} />
            </div>

            <div className='mb-2'>
                <label htmlFor="date">Date: </label>
                <input type='date' id="date" placeholder='Enter date' className='form-control'
                    value={date} onChange={e => setDate(e.target.value)} />
            </div>

            <div className='mb-2'>
                <label htmlFor="medicineCost">Time: </label>
                <input type='time' id="time" placeholder='Enter time' className='form-control'
                    value={time} onChange={e => setTime(e.target.value)} />
            </div>
            <div className='mb-2'>
                <label htmlFor="Doctor Name">Doctor Name: </label>
                <input type='number' id="time" placeholder='Enter time' className='form-control'
                    value={doctor} onChange={e => setDoctor(e.target.value)} />
            </div>
            <div className='mb-2'>
                <label htmlFor="patient">Patient: </label>
                <input type='number' id="time" placeholder='Enter patient' className='form-control'
                    value={patient} onChange={e => setPatient(e.target.value)} />
            </div>
            <button type="button" className='btn btn-success' onClick={handleUpdateAppointment}>Submit</button>
        </div>
    
    );

}

export default UpdateAppointment;
