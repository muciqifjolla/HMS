import React, { useState } from 'react';
import Medicine from "./Rating/Rating";
import CreateRating from "./Rating/CreateRating";
import UpdateRating from "./Rating/UpdateRating";

export function Ratings() {

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedRatingId, setSelectedRatingId] = useState(null); 

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
                    setSelectedRatingId={setSelectedRatingId}
                />
                {showCreateForm && <CreateRating />}
                
                {showUpdateForm && <UpdateRating id={selectedRatingId} />} 
            </div>
        </>
    );
}

export default Ratings;
