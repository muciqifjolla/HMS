import React, { useState } from 'react';
import Patient from "./Patient/Patient";
import CreatePatient from "./Patient/CreatePatient";
import UpdatePatient from "./Patient/UpdatePatient";

export function Patients() {

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState(null); // Corrected state name
    
    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        if (showUpdateForm) {
            setShowUpdateForm(false); 
        }
    };

    const handleUpdateFormToggle = () => {
        setShowUpdateForm(!showUpdateForm);
        if (showCreateForm) {
            setShowCreateForm(false); 
        }
    };

    return (
        <>
            <div> 
                <Patient
                    showCreateForm={showCreateForm}
                    setShowCreateForm={handleCreateFormToggle}
                    showUpdateForm={showUpdateForm} 
                    setShowUpdateForm={handleUpdateFormToggle} 
                    setSelectedPatientId={setSelectedPatientId} // Corrected state setter function name
                />
                {showCreateForm && <CreatePatient />}
                {showUpdateForm && <UpdatePatient id={selectedPatientId} />} 
            </div>
        </>
    );
}

export default Patients;
