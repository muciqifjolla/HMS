import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateDepartment from './CreateDepartment';

function Department({ 
    showCreateForm, 
    setShowCreateForm,
    showUpdateForm, 
    setShowUpdateForm, 
    setSelectedDepartmentIdId
}) {
    const [department, setDepartment] = useState([]);
    const [deleteDepartmentId, setDeleteDepartmentId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredDepartment, setFilteredDepartment] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);

    useEffect(() => {
        axios
            .get('http://localhost:9004/api/department')
            .then((res) => {
                setDepartment(res.data);
                setFilteredDepartment(res.data);
            })
            .catch((err) => console.log(err));
    }, []);

    const handleUpdateButtonClick = (departmentId) => {
        setSelectedDepartmentIdId(departmentId);
        setShowUpdateForm((prevState) => prevState === departmentId ? null : departmentId);
        if (showCreateForm) {
            setShowCreateForm(false); 
        }
    };
    
    const handleDelete = (id) => {
        setDeleteDepartmentId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/department/delete/${deleteDepartmentId}`);
            setDepartment(department.filter((item) => item.Dept_ID !== deleteDepartmentId));
            setFilteredDepartment(filteredDepartment.filter((item) => item.Dept_ID !== deleteDepartmentId));
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
        setDeleteDepartmentId(null);
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
        const filtered = department
            .filter((item) =>
                item.Dept_head.toLowerCase().startsWith(searchQuery.toLowerCase())
            )
            .sort((a, b) => b.Dept_ID - a.Dept_ID);
    
        setFilteredDepartment(filtered);
    
    }, [searchQuery, department, currentPage]);

    // Logic to calculate current records for pagination
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredDepartment.slice(indexOfFirstRecord, indexOfLastRecord);

    // Change page
    const paginate = pageNumber => {
        setCurrentPage(pageNumber);
    };


    return (
        <div className='container-fluid mt-4'>
             {/* Render Delete Confirmation Dialog */}
         {deleteDepartmentId && (
                <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
                    <div className="bg-white p-8 mx-auto rounded-lg">
                        <h1 className="text-lg font-bold mb-4">Confirm Deletion</h1>
                        <p className="mb-4">Are you sure you want to delete this department record?</p>
                        <div className="flex justify-end">
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mr-2 rounded"
                                onClick={handleDeleteConfirm}
                            >
                                Delete
                            </button>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                onClick={() => setDeleteDepartmentId(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

    {/* Conditionally render the "Add Department" button or "Close" button based on showCreateForm */}
            {/* Add pagination controls */}
            {showCreateForm ? null : (
                <div className="mt-4">
                    <button
                        className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        style={{ borderRadius: '0.5rem' }}
                        onClick={handleCreateFormToggle}
                    >
                        Add Department
                    </button>
                </div>
            )}
    
            {/* Pagination buttons and Add Department button */}
            <div className="mt-4">
                {/* Pagination buttons */}
                {filteredDepartment.length > recordsPerPage && (
                    <div className="flex justify-end">
                        {currentPage > 1 && (
                            <button className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => paginate(currentPage - 1)}>Previous</button>
                        )}
                        {currentPage < Math.ceil(filteredDepartment.length / recordsPerPage) && (
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => paginate(currentPage + 1)}>Next</button>
                        )}
                    </div>
                )}
            </div>
    
            {/* Render CreateDepartment component only when showCreateForm is true */}
            {showCreateForm && <CreateDepartment onClose={() => setShowCreateForm(false)} />}
    
            {/* Search Input */}
            <div className="mt-4">
                <input
                    type="text"
                    id="test"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className="border border-gray-300 px-4 py-2 rounded-md"
                />
            </div>
            {/* Render Table */}
    <div className="table-responsive mt-4">
        <div className="py-8">
            <h2 className="text-2xl font-semibold leading-tight">Departments</h2>
            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Department Head</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Department Name</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Emp_Count</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Update</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.map((data, i) => (
                                <tr key={i}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm" >{data.Dept_head}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Dept_name}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Emp_Count}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {showUpdateForm === data.Dept_ID ? (
                                                    // If the update form is shown for this department, render nothing
                                                    null
                                                ) : (
                                                    // If the update form is not shown, render the "Update" button
                                                    <button
                                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                        onClick={() => handleUpdateButtonClick(data.Dept_ID)}
                                                    >
                                                        Update
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <button
                                                    className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                    onClick={() => handleDelete(data.Dept_ID)}
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

export default Department;
