import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateStaff from './CreateStaff';

function Staff({
    showCreateForm,
    setShowCreateForm,
    showUpdateForm,
    setShowUpdateForm,
    setSelectedStaffId,
}) {
    const [staff, setStaff] = useState([]);
    const [deleteStaffId, setDeleteStaffId] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredStaff, setFilteredStaff] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(7);

    useEffect(() => {
        axios.get('http://localhost:9004/api/staff')
            .then(res => {
                console.log("Staff data:", res.data);
                setStaff(res.data);
                setFilteredStaff(res.data);
            })
            .catch(err => console.error('Error fetching staff:', err));

            
        axios
        .get('http://localhost:9004/api/department')
        .then((res) => {
            console.log("Patients data:", res.data);
            setDepartments(res.data);
        })
        .catch((err) => console.error('Error fetching depatments:', err));

    }, []);

    const handleUpdateButtonClick = (staffId) => {
        setSelectedStaffId(staffId);
        setShowUpdateForm((prevState) => prevState === staffId ? null : staffId);
        if (showCreateForm) {
            setShowCreateForm(false);
        }
    };

    const handleDelete = (id) => {
        setDeleteStaffId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/staff/delete/${deleteStaffId}`);
            setStaff(staff.filter((data) => data.Emp_ID !== deleteStaffId));
            setFilteredStaff(filteredStaff.filter((data) => data.Emp_ID !== deleteStaffId));
            if (showCreateForm) {
                setShowCreateForm(false);
            }
            if (showUpdateForm) {
                setShowUpdateForm(false);
            }
        } catch (err) {
            console.error('Error deleting staff:', err);
        }
        setDeleteStaffId(null);
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
        setCurrentPage(1); 
    };

    useEffect(() => {
        const filtered = staff
            .filter((item) =>
                item.Email.toLowerCase().startsWith(searchQuery.toLowerCase())
            )
            .sort((a, b) => b.Emp_ID - a.Emp_ID);
    
        setFilteredStaff(filtered);
    
    }, [searchQuery, staff, currentPage]);
   
    

const indexOfLastRecord = currentPage * recordsPerPage; //1 * 10 = 10
const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;//10-10 = 0
const currentRecords = filteredStaff.slice(indexOfFirstRecord, indexOfLastRecord);

// Change page
const paginate = pageNumber => {
    setCurrentPage(pageNumber);
};

const getDepartmentName = (departmentId) => { 
    console.log("Department ID:", departmentId);
    console.log("Departments:", departments);

    const department = departments.find(dept => dept.Dept_ID === departmentId);
    console.log("Found Department:", department);

    if (department) {
        return `${department.Dept_name}`;
    } else {
        return 'Unknown';
    }
};

    return (
        <div className="container-fluid mt-4">
            {/* Render staff deletion confirmation dialog */}
            {deleteStaffId && (
                <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
                    <div className="bg-white p-8 mx-auto rounded-lg">
                        <h1 className="text-lg font-bold mb-4">Confirm Deletion</h1>
                        <p className="mb-4">Are you sure you want to delete this staff record?</p>
                        <div className="flex justify-end">
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mr-2 rounded"
                                onClick={handleDeleteConfirm}
                            >
                                Delete
                            </button>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                onClick={() => setDeleteStaffId(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Conditionally render the "Add Insurance" button or "Close" button based on showCreateForm */}
                {/* Add pagination controls */}
                {showCreateForm ? null : (
                    <div>
                        <button
                            className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            style={{ borderRadius: '0.5rem' }}
                            onClick={handleCreateFormToggle}
                        >
                            Add Staff
                        </button>
                    </div>
                )}

                  {/* Pagination buttons and Add Insurance button */}
                  <div className="mt-4">
                    {/* Pagination buttons */}
                    {filteredStaff.length > recordsPerPage && (
                        <div className="flex justify-end">
                        <div>
                            {currentPage > 1 && (
                                <button className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => paginate(currentPage - 1)}>Previous</button>
                            )}
                            {currentPage < Math.ceil(filteredStaff.length / recordsPerPage) && (
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => paginate(currentPage + 1)}>Next</button>
                            )}
                        </div>
                        </div>
                    )}
                </div>
    {/* Render CreateInsurance component only when showCreateForm is true */}
    {showCreateForm && <CreateStaff onClose={() => setShowCreateForm(false)} />}
        
        {/* Search Input */}
        <div className="mt-4">
        <input
            type="text"
            id="searchInput"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="border border-gray-300 px-4 py-2 rounded-md"
        />
        </div>
            

            {/* Staff table */}
           {/* Render Table */}
<div className="table-responsive mt-4">
    <div className="py-8">
        <h2 className="text-2xl font-semibold leading-tight">Staff</h2>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Surname</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Joining Date</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Address</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Department</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">SSN</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">DOB</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date of Separation</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Update</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRecords.map((data, i) => (
                            <tr key={i}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Emp_Fname}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Emp_Lname}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Joining_Date}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Emp_type}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Email}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Address}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{getDepartmentName(data.Dept_ID)}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.SSN}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.DOB}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Date_Separation}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        onClick={() => handleUpdateButtonClick(data.Emp_ID)}
                                    >
                                        Update
                                    </button>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                                        onClick={() => handleDelete(data.Emp_ID)}
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
export default Staff;
