import React, { useState } from 'react';
import Staff from "./Staff/Staff";
import CreateStaff from "./Staff/CreateStaff";
import UpdateStaff from "./Staff/UpdateStaff";

export function Staffs() {

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedStaffId, setSelectedStaffIdId] = useState(null); 
    return (
        <>
            <div> 
                <Staff
                   
                    setShowCreateForm={setShowCreateForm}
                    setShowUpdateForm={setShowUpdateForm} 
                    setSelectedStaffIdId={setSelectedStaffIdId} 
                />
                {showCreateForm && <CreateStaff />}
                
                {showUpdateForm && <UpdateAppointment id={selectedAppointmentId} />} 
            </div>
        </>
    );
}

export default Staffs;
