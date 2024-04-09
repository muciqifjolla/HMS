import React, { useState } from 'react';
import Medicine from "./Tables/Medicine";
import CreateMedicine from "./Tables/CreateMedicine";
import UpdateMedicine from "./Tables/UpdateMedicine";

export function Tables() {

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedMedicineId, setSelectedMedicineId] = useState(null); 
    return (
        <>
            <div> 
                <Medicine
                   
                    setShowCreateForm={setShowCreateForm}
                    setShowUpdateForm={setShowUpdateForm} 
                    setSelectedMedicineId={setSelectedMedicineId} 
                />
                {showCreateForm && <CreateMedicine />}
                
                {showUpdateForm && <UpdateMedicine id={selectedMedicineId} />} 
            </div>
        </>
    );
}

export default Tables;
