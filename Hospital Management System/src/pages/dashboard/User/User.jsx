import axios from 'axios';
import React, { useEffect, useState } from 'react';

function User({
    showCreateForm,
    setShowCreateForm,
    showUpdateForm,
    setShowUpdateForm,
    setSelectedUserId,
}) {
    const [users, setUsers] = useState([]);
    const [deleteUserId, setDeleteUserId] = useState(null);

    const handleUpdateButtonClick = (userId) => {
        setSelectedUserId(userId);
        setShowUpdateForm(!showUpdateForm);
    };

    useEffect(() => {
        axios
            .get('http://localhost:9004/api/users')
            .then((res) => setUsers(res.data))
            .catch((err) => console.log(err));
    }, []);

    const handleDelete = (id) => {
        setDeleteUserId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/users/delete/${deleteUserId}`);
            setUsers(users.filter((user) => user.user_id !== deleteUserId));

            // Close the update form if open
            if (showUpdateForm) {
                setShowUpdateForm(false);
            }
            
            // Close the create form if open
            if (showCreateForm) {
                setShowCreateForm(false);
            }
            
        } catch (err) {
            console.log(err);
        }
        setDeleteUserId(null);
    };

    return (
        <div className="container-fluid mt-4">
            {deleteUserId && (
                <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
                    <div className="bg-white p-8 mx-auto rounded-lg">
                        <h1 className="text-lg font-bold mb-4">Confirm Deletion</h1>
                        <p className="mb-4">Are you sure you want to delete this user?</p>
                        <div className="flex justify-end">
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mr-2 rounded"
                                onClick={handleDeleteConfirm}
                            >
                                Delete
                            </button>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                onClick={() => setDeleteUserId(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button
                className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                style={{ borderRadius: '0.5rem' }}
                onClick={() => setShowCreateForm(!showCreateForm)}
            >
                {showCreateForm ? 'Close Add Form' : 'Add User'}
            </button>

            <div className="table-responsive">
                <div className="py-8">
                    <h2 className="text-2xl font-semibold leading-tight">Users</h2>
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Username</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Full Name</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Phone</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Update</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.user_id}>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.email}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.username}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.fullName}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.phone}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <button
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                    onClick={() => handleUpdateButtonClick(user.user_id)}
                                                >
                                                    {showUpdateForm ? 'Close Update Form' : 'Update'}
                                                </button>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <button
                                                    className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                    onClick={() => handleDelete(user.user_id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default User;
