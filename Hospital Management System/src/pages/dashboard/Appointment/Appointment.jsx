import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Appointment({ showCreateForm, setShowCreateForm,showUpdateForm, setShowUpdateForm, setSelectedAppointmentIdId}) {
    
    const [appointment, setAppointment] = useState([]);


    const handleUpdateButtonClick = (appointmentId) => {
        setSelectedAppointmentIdId(appointmentId);
        setShowUpdateForm(!showUpdateForm);
    };
    

    useEffect(() => {
        axios.get('http://localhost:9004/api/appointment')
            .then(res => setAppointment(res.data))
            .catch(err => console.log(err));
    }, []);



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
                <table className='table table-bordered shadow-sm' style={{ borderRadius: '0.5rem', overflow: 'hidden', maxWidth: '700px' }}>
                    <thead className="thead-dark">
                        <tr className="flex gap-5">
                            <th>Scheduled_On</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Doctor_ID</th>
                            <th>Patient_ID</th>
                            <th>Update</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointment.map((data, i) => (
                            <tr className="flex gap-5" key={i}>
                                <td>{new Date(data.Scheduled_On).toLocaleDateString()}</td>
                                <td>{new Date(data.Date).toLocaleDateString()}</td>
                                <td>{data.Time}</td>  
                                <td>{data.Doctor_ID}</td>  
                                <td>{data.Patient_ID}</td>  
                                <td>
                                    <button className='btn btn-success mb-3' style={{ borderRadius: '0.5rem' }} onClick={() => handleUpdateButtonClick(data.Appoint_ID)}>
                                    {showUpdateForm ? 'Close Update Form' : 'Update'}
                                    </button>
                                </td>
                                
                                <td>
                                    <button className='btn btn-danger' onClick={() => handleDelete(data.Appoint_ID)} style={{ borderRadius: '0.5rem', padding: '5px 10px' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Appointment;
