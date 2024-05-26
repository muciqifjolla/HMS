import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateUser from './CreateUser';


function User({
    showCreateForm,
    setShowCreateForm,
    setShowUpdateForm,
    showUpdateForm,
    setSelectedUserId,
}) {
    const [users, setUsers] = useState([]);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(7);


    // const handleUpdateButtonClick = (userId) => {
    //     setSelectedUserId(userId);
    //     setShowUpdateForm(!showUpdateForm);
    // };


    useEffect(() => {
        axios
            .get('http://localhost:9004/api/users')
            .then((res) => {
                setUsers(res.data);
                setFilteredUsers(res.data);
            })
            .catch((err) => console.log(err));
    }, []);

    const handleUpdateButtonClick = (userId) => {
        setSelectedUserId(userId);
        setShowUpdateForm((prevState) => prevState === userId ? null : userId);
        if (showCreateForm) {
            setShowCreateForm(false); 
        }
    };

    const handleDelete = (id) => {
        setDeleteUserId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/users/delete/${deleteUserId}`);
            setUsers(users.filter((user) => user.user_id !== deleteUserId));
            setFilteredUsers(filteredUsers.filter((item) => item.user_id !== deleteUserId));
            
            // Close the create form if open
            if (showCreateForm) {
                setShowCreateForm(false);
            }
             // Close the update form if open
             if (showUpdateForm) {
                setShowUpdateForm(false);
            }
            
        } catch (err) {
            console.log(err);
        }
        setDeleteUserId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false);
    };

    const handleCloseCreateForm = () => {
        setShowCreateForm(false);
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset currentPage to 1 when the search query changes
    };

    useEffect(() => {
        const filtered = users
            .filter((item) =>
                item.username.toLowerCase().startsWith(searchQuery.toLowerCase())
            )
            .sort((a, b) => b.user_id - a.user_id);

        setFilteredUsers(filtered);

    }, [searchQuery, users, currentPage]);

    // Logic to calculate current records for pagination
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredUsers.slice(indexOfFirstRecord, indexOfLastRecord);

    // Change page
    const paginate = pageNumber => {
        setCurrentPage(pageNumber);
    };

    

    return (
        <div className='container-fluid mt-4'>
            {/* {showErrorModal && (
                <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
            )} */}

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
            {showCreateForm ? null : (
                <div className="mt-4">
                    <button
                        className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        style={{ borderRadius: '0.5rem' }}
                        onClick={handleCreateFormToggle}
                    >
                        Add User
                    </button>
                </div>
            )}

            <div className="mt-4">
                {/* Pagination buttons */}
                {filteredUsers.length > recordsPerPage && (
                    <div className="flex justify-end">
                        {currentPage > 1 && (
                            <button className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => paginate(currentPage - 1)}>Previous</button>
                        )}
                        {currentPage < Math.ceil(filteredUsers.length / recordsPerPage) && (
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => paginate(currentPage + 1)}>Next</button>
                        )}
                    </div>
                )}
            </div>
    
            {/* <button
                className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                style={{ borderRadius: '0.5rem' }}
                onClick={() => setShowCreateForm(!showCreateForm)}
            >
                {showCreateForm ? 'Close Add Form' : 'Add User'}
            </button> */}
     {showCreateForm && <CreateUser onClose={() => setShowCreateForm(false)} />}
     {/* Search Input */}
     <div className="mt-4">
                <input
                    type="text"
                    id="test"
                    placeholder="Search by username..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className="border border-gray-300 px-4 py-2 rounded-md"
                />
            </div>

            <div className="table-responsive mt-4">
                <div className="py-8">
                    <h2 className="text-2xl font-semibold leading-tight">Users</h2>
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Username</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Update</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Delete</th>
                                        </tr>
                                </thead>
                                <tbody>
                                {currentRecords.map((user) => (
                                        <tr key={user.user_id}>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.email}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.username}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {showUpdateForm === user.user_id ? (
                                                    // If the update form is shown for this user, render nothing
                                                    null
                                                ) : (
                                                    // If the update form is not shown, render the "Update" button
                                                    <button
                                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                        onClick={() => handleUpdateButtonClick(user.user_id)}
                                                    >
                                                        Update
                                                    </button>
                                                )}
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