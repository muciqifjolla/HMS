import React, { useState } from 'react';
import axios from 'axios';
import Medicine from "./Medicine/Medicine";
import CreateMedicine from "./Medicine/CreateMedicine";
import UpdateMedicine from "./Medicine/UpdateMedicine";

export function Medicines() {

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedMedicineId, setSelectedMedicineId] = useState(null); 

    const handleUpdateButtonClick = (medicineId) => {
        setSelectedMedicineId(medicineId);
        setShowUpdateForm((prevState) => prevState === medicineId ? null : medicineId);
        setShowCreateForm(false); // Close create form if open
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:9004/api/medicine/delete/${id}`);
            setShowCreateForm(false);
            setShowUpdateForm(false);
            // Fetch and update medicine list here if needed
        } catch (error) {
            console.error('Error deleting medicine:', error);
        }
    };

    

    return (
        <>
            <div> 
            
                <Medicine
                    showCreateForm={showCreateForm}
                    setShowCreateForm={setShowCreateForm}
                    setShowUpdateForm={setShowUpdateForm}
                    setSelectedMedicineId={setSelectedMedicineId}
                    showUpdateForm={showUpdateForm}
                    handleUpdateButtonClick={handleUpdateButtonClick}
                    handleDelete={handleDelete}
                />

                {showCreateForm && <CreateMedicine onClose={() => setShowCreateForm(false)}/>}
                {showUpdateForm && <UpdateMedicine id={selectedMedicineId} setShowUpdateForm={setShowUpdateForm} onClose={() => setShowUpdateForm(false)}/>} 
            </div>
        </>
    );
}

export default Medicines;
