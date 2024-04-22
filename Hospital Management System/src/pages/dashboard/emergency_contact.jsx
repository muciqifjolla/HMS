import React, { useState } from 'react';
import Emergency_Contact from "./Emergency_Contact/Emergency_Contact"
// import CreateMedicine from "./Tables/CreateMedicine";
// import UpdateMedicine from "./Tables/UpdateMedicine";
import CreateEmergency_Contact from "./Emergency_Contact/CreateEmergency_Contact"
import UpdateEmergency_Contact from "./Emergency_Contact/UpdateEmergency_Contact"
export function Emergency_Contacts() {

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedEmergency_ContactId, setSelectedEmergency_ContactId] = useState(null); 
    return (
        <>
            <div> 
                <Emergency_Contact
                   
                    setShowCreateForm={setShowCreateForm}
                    setShowUpdateForm={setShowUpdateForm} 
                    setSelectedEmergency_ContactId={setSelectedEmergency_ContactId} 
                />
                {showCreateForm && <CreateEmergency_Contact />}
                
                {showUpdateForm && <UpdateEmergency_Contact id={selectedEmergency_ContactId} />} 
            </div>
        </>
    );
}

export default Emergency_Contacts;
