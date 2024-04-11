import React, { useState } from 'react';
import Appointment from "./Appointment/Appointment";
import CreateAppointment from "./Appointment/CreateAppointment";
import UpdateAppointment from "./Appointment/UpdateAppointment";

export function Appointments() {

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentIdId] = useState(null); 
    return (
        <>
            <div> 
                <Appointment
                   
                    setShowCreateForm={setShowCreateForm}
                    setShowUpdateForm={setShowUpdateForm} 
                    setSelectedAppointmentIdId={setSelectedAppointmentIdId} 
                />
                {showCreateForm && <CreateAppointment />}
                
                {showUpdateForm && <UpdateAppointment id={selectedAppointmentId} />} 
            </div>
        </>
    );
}

export default Appointments;
