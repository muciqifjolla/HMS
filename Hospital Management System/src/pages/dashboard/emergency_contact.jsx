import React, { useState } from 'react';
import axios from 'axios';
import Emergency_Contact from './Emergency_Contact/Emergency_Contact';
import CreateEmergency_Contact from './Emergency_Contact/CreateEmergency_Contact';
import UpdateEmergency_Contact from './Emergency_Contact/UpdateEmergency_Contact';

export function Emergency_Contacts() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedEmergency_ContactId, setSelectedEmergency_ContactId] = useState(null);

    const handleUpdateButtonClick = (emergencyContactId) => {
        setSelectedEmergency_ContactId(emergencyContactId);
        setShowUpdateForm((prevState) => prevState === emergencyContactId ? null : emergencyContactId);
        setShowCreateForm(false); // Close create form if open
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:9004/api/emergency_contact/delete/${id}`);
            setShowCreateForm(false);
            setShowUpdateForm(false);
            // Fetch and update emergency contact list here if needed
        } catch (error) {
            console.error('Error deleting emergency contact:', error);
        }
    };


    return (
        <>
            <div>
                <Emergency_Contact
                    showCreateForm={showCreateForm}
                    setShowCreateForm={setShowCreateForm}
                    setShowUpdateForm={setShowUpdateForm}
                    setSelectedEmergency_ContactId={setSelectedEmergency_ContactId}
                    showUpdateForm={showUpdateForm}
                    handleUpdateButtonClick={handleUpdateButtonClick}
                    handleDelete={handleDelete}
                />
                {showCreateForm && <CreateEmergency_Contact onClose={() => setShowCreateForm(false)} />}
                {showUpdateForm && <UpdateEmergency_Contact id={selectedEmergency_ContactId} setShowUpdateForm={setShowUpdateForm} onClose={() => setShowUpdateForm(false)}/>}
            </div>
        </>
    );
}

export default Emergency_Contacts;