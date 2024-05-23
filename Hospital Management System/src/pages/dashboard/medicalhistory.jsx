import React, { useState } from 'react';
import axios from 'axios';

import MedicalHistory from "./MedicalHistory/MedicalHistory";
import UpdateMedicalHistory from './MedicalHistory/UpdateMedicalHistory';
import CreateMedicalHistory from './MedicalHistory/CreateMedicalHistory';

export function MedicalHistorys() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedMedicalHistoryId, setSelectedMedicalHistoryId] = useState(null); 

    const handleUpdateButtonClick = (medicalHistoryId) => {
        setSelectedMedicalHistoryId(medicalHistoryId);
        setShowUpdateForm((prevState) => prevState === medicalHistoryId ? null : medicalHistoryId);
        setShowCreateForm(false); // Close create form if open
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:9004/api/medicalhistory/delete/${id}`);
            setShowCreateForm(false);
            setShowUpdateForm(false);
            // Fetch and update insurance list here if needed
        } catch (error) {
            console.error('Error deleting medical history:', error);
        }
    };

    return (
        <>
            <div> 
                <MedicalHistory
                    showCreateForm={showCreateForm}
                    setShowCreateForm={setShowCreateForm}
                    setShowUpdateForm={setShowUpdateForm}
                    setSelectedMedicalHistoryId={setSelectedMedicalHistoryId}
                    showUpdateForm={showUpdateForm}
                    handleUpdateButtonClick={handleUpdateButtonClick}
                    handleDelete={handleDelete}
                />
                
                {showCreateForm && <CreateMedicalHistory onClose={() => setShowCreateForm(false)}/>}
                {showUpdateForm && <UpdateMedicalHistory  id={selectedMedicalHistoryId} setShowUpdateForm={setShowUpdateForm} onClose={() => setShowUpdateForm(false)}/>} 
            </div>
        </>
    );
}

export default MedicalHistorys;
