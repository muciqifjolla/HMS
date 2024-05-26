import React, { useState } from 'react';
import Patient from "./Patient/Patient";
import CreatePatient from "./Patient/CreatePatient";
import UpdatePatient from "./Patient/UpdatePatient";

export function Patients() {

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState(null); // Corrected state name
    
    const handleUpdateButtonClick = (patientId) => {
        setSelectedPatientId(patientId);
        setShowUpdateForm((prevState) => prevState === patientId ? null : patientId);
        setShowCreateForm(false); // Close create form if open
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:9004/api/patient/delete/${id}`);
            setShowCreateForm(false);
            setShowUpdateForm(false);
        } catch (error) {
            console.error('Error deleting patient:', error);
        }
    };

    return (
        <>
            <div> 
                <Patient
                    showCreateForm={showCreateForm}
                    setShowCreateForm={setShowCreateForm}
                    setShowUpdateForm={setShowUpdateForm} 
                    setSelectedPatientId={setSelectedPatientId}
                    showUpdateForm={showUpdateForm}
                    handleUpdateButtonClick={handleUpdateButtonClick}
                    handleDelete={handleDelete} // Corrected state setter function name
                />
                {showCreateForm && <CreatePatient onClose={() => setShowCreateForm(false)}/>}
                {showUpdateForm && <UpdatePatient id={selectedPatientId} setShowUpdateForm={setShowUpdateForm} onClose={() => setShowUpdateForm(false)}/>} 
            </div>
        </>
    );
}

export default Patients;
