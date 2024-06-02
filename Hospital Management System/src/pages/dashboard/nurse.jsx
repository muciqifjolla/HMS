import React, { useState } from 'react';
import axios from 'axios';
import Nurse from "./Nurse/Nurse";
import CreateNurse from "./Nurse/CreateNurse";
import UpdateNurse from "./Nurse/UpdateNurse";

export function Nurses() {

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedNurseId, setSelectedNurseId] = useState(null); 
   
    const handleUpdateButtonClick = (nurseId) => {
        setSelectedMedicineId(nurseId);
        setShowUpdateForm((prevState) => prevState === nurseId ? null : nurseId);
        setShowCreateForm(false); // Close create form if open
    };
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:9004/api/nurse/delete/${id}`);
            setShowCreateForm(false);
            setShowUpdateForm(false);
            // Fetch and update nurse list here if needed
        } catch (error) {
            console.error('Error deleting nursse:', error);
        }
    };




    return (
        <>
            <div> 
                <Nurse
                    showCreateForm={showCreateForm}
                    setShowCreateForm={setShowCreateForm}
                    setShowUpdateForm={setShowUpdateForm}
                    setSelectedNurseId={setSelectedNurseId} 
                    showUpdateForm={showUpdateForm}
                    handleUpdateButtonClick={handleUpdateButtonClick}
                    handleDelete={handleDelete}
                />
                {showCreateForm && <CreateNurse />}
                
                {showUpdateForm && <UpdateNurse id={selectedNurseId} setShowUpdateForm={setShowUpdateForm} onClose={() => setShowUpdateForm(false)}/>} 
            </div>
        </>
    );
}

export default Nurses;