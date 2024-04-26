import React, { useState } from 'react';
import MedicalHistoryComponent from "./MedicalHistory/MedicalHistory"; // Rename the import
import CreateMedicalHistory from "./MedicalHistory/CreateMedicalHistory";
import UpdateMedicalHistory from "./MedicalHistory/UpdateMedicalHistory";

export function MedicalHistory() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedMedicalHistoryId, setSelectedMedicalHistoryId] = useState(null);

    return (
        <>
            <div>
                <MedicalHistoryComponent // Use the renamed import here
                    showCreateForm={showCreateForm}
                    setShowCreateForm={setShowCreateForm}
                    showUpdateForm={showUpdateForm}
                    setShowUpdateForm={setShowUpdateForm}
                    setSelectedMedicalHistoryId={setSelectedMedicalHistoryId}
                />
                {showCreateForm && <CreateMedicalHistory />}
                {showUpdateForm && <UpdateMedicalHistory id={selectedMedicalHistoryId} />}
            </div>
        </>
    );
}

export default MedicalHistory;
