import React, { useState } from 'react';
import MedicalHistory from "./MedicalHistory/MedicalHistory";

import CreateMedicalHistory from "./MedicalHistory/CreateMedicalHistory";
import UpdateMedicalHistory  from "./MedicalHistory/UpdateMedicalHistory";

export function MedicalHistorys() {

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedMedicalHistoryId, setSelectedMedicalHistoryId] = useState(null); 
    
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
                <MedicalHistory 
                    showCreateForm={showCreateForm}
                    setShowCreateForm={handleCreateFormToggle}
                    showUpdateForm={showUpdateForm} 
                    setShowUpdateForm={handleUpdateFormToggle} 
                    setSelectedMedicalHistoryId={setSelectedMedicalHistoryId} 
                />
                {showCreateForm && <CreateMedicalHistory />}
                {showUpdateForm && <UpdateMedicalHistory id={selectedMedicalHistoryId} />} 
            </div>
        </>
    );
}

export default MedicalHistorys;
