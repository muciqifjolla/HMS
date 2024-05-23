import React, { useState } from 'react';
import axios from 'axios';
import Appointment from "./Appointment/Appointment";
import CreateAppointment from "./Appointment/CreateAppointment";
import UpdateAppointment from "./Appointment/UpdateAppointment";

export function Appointments() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null); 

    const handleUpdateButtonClick = (appointmentId) => {
        setSelectedAppointmentId(appointmentId);
        setShowUpdateForm((prevState) => prevState === appointmentId ? null : appointmentId);
        setShowCreateForm(false); // Close create form if open
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:9004/api/appointment/delete/${id}`);
            setShowCreateForm(false);
            setShowUpdateForm(false);
            // Fetch and update appointment list here if needed
        } catch (error) {
            console.error('Error deleting appointment:', error);
        }
    };

    return (
        <div>
            <Appointment
                setShowCreateForm={setShowCreateForm}
                setShowUpdateForm={setShowUpdateForm} 
                setSelectedAppointmentId={setSelectedAppointmentId} 
                showUpdateForm={showUpdateForm}
                handleUpdateButtonClick={handleUpdateButtonClick}
                handleDelete={handleDelete}
            />
            {showCreateForm && <CreateAppointment onClose={() => setShowCreateForm(false)} />}
            {showUpdateForm && <UpdateAppointment id={selectedAppointmentId} setShowUpdateForm={setShowUpdateForm} onClose={() => setShowUpdateForm(false)} />} 
        </div>
    );
}

export default Appointments;
