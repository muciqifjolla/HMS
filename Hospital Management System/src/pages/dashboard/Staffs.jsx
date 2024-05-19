import React, { useState } from 'react';
import axios from 'axios';
import Staff from "./Staff/Staff";
import CreateStaff from "./Staff/CreateStaff";
import UpdateStaff from "./Staff/UpdateStaff";

export function Staffs() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedStaffId, setSelectedStaffId] = useState(null);

    const handleUpdateButtonClick = (staffId) => {
        setSelectedStaffId(staffId);
        setShowUpdateForm((prevState) => prevState === staffId ? null : staffId);
        setShowCreateForm(false); // Close create form if open
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:9004/api/staff/delete/${id}`);
            setShowCreateForm(false);
            setShowUpdateForm(false);
            // Fetch and update staff list here if needed
        } catch (error) {
            console.error('Error deleting staff:', error);
        }
    };

    return (
        <>
            <div> 
                <Staff
                    setShowCreateForm={setShowCreateForm}
                    setShowUpdateForm={setShowUpdateForm}
                    setSelectedStaffId={setSelectedStaffId}
                    handleUpdateButtonClick={handleUpdateButtonClick}
                    handleDelete={handleDelete}
                />
                
                {showCreateForm && <CreateStaff onClose={() => setShowCreateForm(false)} />}
                {showUpdateForm && <UpdateStaff id={selectedStaffId} onClose={() => setShowUpdateForm(false)} />} 
            </div>
        </>
    );
}

export default Staffs;
