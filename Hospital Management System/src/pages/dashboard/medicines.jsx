import React, { useState } from 'react';
import Medicine from "./Tables/Medicine";
import CreateMedicine from "./Tables/CreateMedicine";
import UpdateMedicine from "./Tables/UpdateMedicine";

export function Medicines() {

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedMedicineId, setSelectedMedicineId] = useState(null); 

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        if (showUpdateForm) {
            setShowUpdateForm(false); // Ensure update form is closed
        }
    };

    const handleUpdateFormToggle = () => {
        setShowUpdateForm(!showUpdateForm);
        if (showCreateForm) {
            setShowCreateForm(false); // Ensure create form is closed
        }
    };



    return (
        <>
            <div> 
                <Medicine
                   
                    showCreateForm={showCreateForm}
                    setShowCreateForm={handleCreateFormToggle}
                    showUpdateForm={showUpdateForm}
                    setShowUpdateForm={handleUpdateFormToggle}
                    setSelectedMedicineId={setSelectedMedicineId}
                />
                {showCreateForm && <CreateMedicine />}
                
                {showUpdateForm && <UpdateMedicine id={selectedMedicineId} />} 
            </div>
        </>
    );
}

export default Medicines;
