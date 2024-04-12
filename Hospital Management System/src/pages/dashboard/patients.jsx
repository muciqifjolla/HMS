import React, { useState } from 'react';
import Patient from "./Patient/Patient";
import CreatePatient from "./Patient/CreatePatient";
import UpdatePatient from "./Patient/UpdatePatient";

export function Patients() {

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedPatientId, setSelectedPatientIdId] = useState(null); 
    return (
        <>
            <div> 
                <Patient
                   
                    setShowCreateForm={setShowCreateForm}
                    setShowUpdateForm={setShowUpdateForm} 
                    setSelectedPatientIdId={setSelectedPatientIdId} 
                />
                {showCreateForm && <CreatePatient />}
                
                {showUpdateForm && <UpdatePatient id={selectedPatientId} />} 
            </div>
        </>
    );
}

export default Patients;
