import React, { useState } from 'react';
import Nurse from "./Nurse/Nurse";
import CreateNurse from "./Nurse/CreateNurse";
import UpdateNurse from "./Nurse/UpdateNurse";

export function Nurses() {

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedNurseId, setSelectedNurseIdId] = useState(null); 
   
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
                <Nurse
                    showCreateForm={showCreateForm}
                    setShowCreateForm={handleCreateFormToggle}
                    showUpdateForm={showUpdateForm}
                    setShowUpdateForm={handleUpdateFormToggle}
                    setSelectedNurseIdId={setSelectedNurseIdId} 
                />
                {showCreateForm && <CreateNurse />}
                
                {showUpdateForm && <UpdateNurse id={selectedNurseId} />} 
            </div>
        </>
    );
}

export default Nurses;