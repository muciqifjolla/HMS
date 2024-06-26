import React, { useState } from 'react';
import axios from 'axios';
import User from "./User/User";
import CreateUser from "./User/CreateUser";
import UpdateUser from "./User/UpdateUser";

export function Users() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const handleUpdateButtonClick = (userId) => {
        setSelectedUserId(userId);
        setShowUpdateForm((prevState) => prevState === userId ? null : userId);
        setShowCreateForm(false); // Close create form if open
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:9004/api/users/delete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            });
            setShowCreateForm(false);
            setShowUpdateForm(false);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <>
            <div>
                <User
                    showCreateForm={showCreateForm}
                    setShowCreateForm={setShowCreateForm}
                    setShowUpdateForm={setShowUpdateForm}
                    setSelectedUserId={setSelectedUserId}
                    showUpdateForm={showUpdateForm}
                    handleUpdateButtonClick={handleUpdateButtonClick}
                    handleDelete={handleDelete}
                />
                {showCreateForm && <CreateUser onClose={() => setShowCreateForm(false)} />}
                {showUpdateForm && <UpdateUser id={selectedUserId} setShowUpdateForm={setShowUpdateForm} onClose={() => setShowUpdateForm(false)} />}
            </div>
        </>
    );
}

export default Users;
