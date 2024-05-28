import React, { useState } from 'react';
import Visit from "./Visit/Visit";
import CreateVisit from "./Visit/CreateVisit";
import UpdateVisit from "./Visit/UpdateVisit";

export function Visits() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedVisitId, setSelectedVisitId] = useState(null);

    const handleUpdateButtonClick = (visitId) => {
        setSelectedVisitId(visitId);
        setShowUpdateForm((prevState) => prevState === visitId ? null : visitId);
        setShowCreateForm(false);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:9004/api/visit/delete/${id}`);
            setShowCreateForm(false);
            setShowUpdateForm(false);
        } catch (error) {
            console.error('Error deleting visit:', error);
        }
    };

    return (
        <>
            <div> 
                <Visit
                    showCreateForm={showCreateForm}
                    setShowCreateForm={setShowCreateForm}
                    showUpdateForm={showUpdateForm} 
                    setShowUpdateForm={setShowUpdateForm}
                    setSelectedVisitId={setSelectedVisitId}
                    handleUpdateButtonClick={handleUpdateButtonClick}
                    handleDelete={handleDelete}
                />
                {showCreateForm && <CreateVisit onClose={() => setShowCreateForm(false)}/>}
                {showUpdateForm && <UpdateVisit id={selectedVisitId} setShowUpdateForm={setShowUpdateForm} onClose={() => setShowUpdateForm(false)} />} 
            </div>
        </>
    );
}

export default Visits;
