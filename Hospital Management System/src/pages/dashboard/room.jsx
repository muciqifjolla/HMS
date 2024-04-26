import React, { useState } from 'react';
import Room from "./Room/Room";
import CreateRoom from "./Room/CreateRoom";
import UpdateRoom from "./Room/UpdateRoom";

export function Rooms() {

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState(null); // Corrected state name

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
                <Room
                    showCreateForm={showCreateForm}
                    setShowCreateForm={handleCreateFormToggle}
                    showUpdateForm={showUpdateForm} 
                    setShowUpdateForm={handleUpdateFormToggle}
                    setSelectedRoomId={setSelectedRoomId} // Corrected state setter function name
                />
                {showCreateForm && <CreateRoom />}
                {showUpdateForm && <UpdateRoom id={selectedRoomId} />} 
            </div>
        </>
    );
}

export default Rooms;
