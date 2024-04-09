import React, { useState } from 'react';
import Appointment from "./Appointment/Appointment";
import CreateMedicine from "./Tables/CreateMedicine";
import UpdateMedicine from "./Tables/UpdateMedicine";

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
                {showCreateForm && <CreateMedicine />}
                
                {showUpdateForm && <UpdateMedicine id={selectedAppointmentId} />} 
            </div>
        </>
    );
}

export default Appointments;
