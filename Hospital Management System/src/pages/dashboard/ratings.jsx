import React, { useState } from 'react';
import Rating from "./Rating/Rating";
import CreateRating from "./Rating/CreateRating";
import UpdateRating from "./Rating/UpdateRating"

export function Ratings() {

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedRatingId, setSelectedRatingId] = useState(null); 

    const handleUpdateButtonClick = (ratingId) => {
        setSelectedRatingId(ratingId);
        setShowUpdateForm((prevState) => prevState === ratingId ? null : ratingId);
        setShowCreateForm(false); // Close create form if open
    };

    const handleDelete = async (id) => {
        try {
            // Assuming you have an endpoint for deleting ratings
            await axios.delete(`http://localhost:9004/api/rating/delete/${id}`);
            setShowCreateForm(false);
            setShowUpdateForm(false);
            // Fetch and update rating list here if needed
        } catch (error) {
            console.error('Error deleting rating:', error);
        }
    };

    return (
        <>
            <div> 
                <Rating
                    showCreateForm={showCreateForm}
                    setShowCreateForm={setShowCreateForm}
                    setShowUpdateForm={setShowUpdateForm}
                    setSelectedRatingId={setSelectedRatingId}
                    showUpdateForm={showUpdateForm}
                    handleUpdateButtonClick={handleUpdateButtonClick}
                    handleDelete={handleDelete}
                />
                {showCreateForm && <CreateRating onClose={() => setShowCreateForm(false)}/>}
                {showUpdateForm && <UpdateRating id={selectedRatingId} setShowUpdateForm={setShowUpdateForm} onClose={() => setShowUpdateForm(false)}/>} 
            </div>
        </>
    );
}

export default Ratings;
