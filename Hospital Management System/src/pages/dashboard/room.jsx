import React, { useState } from 'react';
import Room from "./Room/Room";
import CreateRoom from "./Room/CreateRoom";
import UpdateRoom from "./Room/UpdateRoom";

export function Rooms() {

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState(null); // Corrected state name


    const handleUpdateButtonClick = (roomId) => {
        setSelectedPatientId(roomId);
        setShowUpdateForm((prevState) => prevState === roomId ? null : roomId);
        setShowCreateForm(false); 
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:9004/api/room/delete/${id}`);
            setShowCreateForm(false);
            setShowUpdateForm(false);
        } catch (error) {
            console.error('Error deleting room:', error);
        }
    };
    return (
        <>
            <div> 
                <Room
                    showCreateForm={showCreateForm}
                    setShowCreateForm={setShowCreateForm}
                    showUpdateForm={showUpdateForm} 
                    setShowUpdateForm={setShowUpdateForm}
                    setSelectedRoomId={setSelectedRoomId}
                    handleUpdateButtonClick={handleUpdateButtonClick}
                    handleDelete={handleDelete} // Corrected state setter function name
                />
                {showCreateForm && <CreateRoom onClose={() => setShowCreateForm(false)}/>}
                {showUpdateForm && <UpdateRoom id={selectedRoomId} setShowUpdateForm={setShowUpdateForm} onClose={() => setShowUpdateForm(false)} />} 
            </div>
        </>
    );
}

export default Rooms;
