import React, { useState } from 'react';
import User from "./User/User";
import CreateUser from "./User/CreateUser";
import UpdateUser from "./User/UpdateUser";

export function Users() {

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null); 

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
                <User
                    showCreateForm={showCreateForm}
                    setShowCreateForm={handleCreateFormToggle}
                    showUpdateForm={showUpdateForm}
                    setShowUpdateForm={handleUpdateFormToggle}
                    setSelectedUserId={setSelectedUserId}
                />
                {showCreateForm && <CreateUser />}
                
                {showUpdateForm && <UpdateUser id={selectedUserId} />} 
            </div>
        </>
    );
}

export default Users;
