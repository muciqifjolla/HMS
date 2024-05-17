import React, { useState } from 'react';
import Appointment from "./Appointment";
import CreateAppointment from "./CreateAppointment";


export function Appointments() {

    const [showCreateForm, setShowCreateForm] = useState(false);
    // const [showUpdateForm, setShowUpdateForm] = useState(false);
    // const [selectedAppointmentId, setSelectedAppointmentIdId] = useState(null); 
    return (
        <>
            <div> 
                <Appointment
                   
                    setShowCreateForm={setShowCreateForm}
                    // setShowUpdateForm={setShowUpdateForm} 
                    // setSelectedAppointmentIdId={setSelectedAppointmentIdId} 
                />
                {showCreateForm && <CreateAppointment onClose={() => setShowCreateForm(false)}/>}
                
                {/* {showUpdateForm && <UpdateAppointment id={selectedAppointmentId} />}  */}
            </div>
        </>
    );
}

export default Appointments;
