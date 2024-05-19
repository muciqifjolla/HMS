import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateDoctor from './CreateDoctor';

function Doctor({
    showCreateForm,
    setShowCreateForm,
    showUpdateForm,
    setShowUpdateForm,
    setSelectedDoctorId,
}) {
    const [doctors, setDoctors] = useState([]);
    const [deleteDoctorId, setDeleteDoctorId] = useState(null);
    const [staff, setStaff] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);

    useEffect(() => {
        axios
            .get('http://localhost:9004/api/doctors')
            .then((res) => {
                console.log("Doctors data:", res.data);
                setDoctors(res.data);
                setFilteredDoctors(res.data);
            })
            .catch((err) => console.error('Error fetching doctors:', err));
            axios
            .get('http://localhost:9004/api/staff')
            .then((res) => {
                console.log("Staff data:", res.data);
                setStaff(res.data);
            })
            .catch((err) => console.error('Error fetching staff:', err));
    
    }, []);

    const handleUpdateButtonClick = (doctorId) => {
        setSelectedDoctorId(doctorId);
        setShowUpdateForm((prevState) => prevState === doctorId ? null : doctorId);
        if (showCreateForm) {
            setShowCreateForm(false); 
        }
    };

    const handleDelete = (id) => {
        setDeleteDoctorId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/doctors/delete/${deleteDoctorId}`);
            setDoctors(doctors.filter((data) => data.Doctor_ID !== deleteDoctorId));
            setFilteredDoctors(filteredDoctors.filter((data) => data.Doctor_ID !== deleteDoctorId));
            if (showCreateForm) {
                setShowCreateForm(false);
            }
            if (showUpdateForm) {
                setShowUpdateForm(false);
            }
        } catch (err) {
            console.error('Error deleting doctor:', err);
        }
        setDeleteDoctorId(null);
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
        const filtered = doctors
            .filter((item) =>
            getDoctorName(item.Doctor_ID).toLowerCase().startsWith(searchQuery.toLowerCase())        
        )

        setFilteredDoctors(filtered);
    }, [searchQuery, doctors]);

    // Logic to calculate current records for pagination
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredDoctors.slice(indexOfFirstRecord, indexOfLastRecord);

    // Change page
    const paginate = pageNumber => {
        setCurrentPage(pageNumber);
    };

    const getDoctorName = (empid) => { 
        console.log("Employee ID:", empid);
        console.log("Doctors:", staff);
    
        const staff = staff.find(doc => doc.Emp_ID === empid);
        console.log("Found Doctor:", staff);
    
        if (staff) {
            return `${staff.Emp_Fname} ${staff.Emp_Lname}`;
        } else {
            return 'Unknown';
        }
    };
    

    return (
        <div className="container-fluid mt-4">
            {/* Render Delete Confirmation Dialog */}
            {deleteDoctorId && (
                <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
                    <div className="bg-white p-8 mx-auto rounded-lg">
                        <h1 className="text-lg font-bold mb-4">Confirm Deletion</h1>
                        <p className="mb-4">Are you sure you want to delete this doctor record?</p>
                        <div className="flex justify-end">
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mr-2 rounded"
                                onClick={handleDeleteConfirm}
                            >
                                Delete
                            </button>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                onClick={() => setDeleteDoctorId(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Conditionally render the "Add Doctor" button or "Close" button based on showCreateForm */}
            {showCreateForm ? null : (
                <div>
                    <button
                        className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        style={{ borderRadius: '0.5rem' }}
                        onClick={handleCreateFormToggle}
                    >
                        Add Doctor
                    </button>
                </div>
            )}

            {/* Pagination buttons and Add Doctor button */}
            <div className="mt-4">
                {/* Pagination buttons */}
                {filteredDoctors.length > recordsPerPage && (
                    <div className="flex justify-end">
                        <div>
                            {currentPage > 1 && (
                                <button className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => paginate(currentPage - 1)}>Previous</button>
                            )}
                            {currentPage < Math.ceil(filteredDoctors.length / recordsPerPage) && (
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => paginate(currentPage + 1)}>Next</button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Render CreateDoctor component only when showCreateForm is true */}
            {showCreateForm && <CreateDoctor onClose={() => setShowCreateForm(false)} />}

            {/* Search Input */}
            <div className="mt-4">
                <input
                    type="text"
                    id="searchInput"
                    placeholder="Search by qualifications or specialization..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className="border border-gray-300 px-4 py-2 rounded-md"
                />
            </div>
            
            {/* Render Table */}
            <div className="table-responsive mt-4">
                <div className="py-8">
                    <h2 className="text-2xl font-semibold leading-tight">Doctors</h2>
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Qualifications</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Employee ID</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Specialization</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">(ID)</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Update</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentRecords.map((data, i) => (
                                        <tr key={i}>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Qualifications}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Emp_ID}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Specialization}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Emp_ID}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {showUpdateForm === data.Emp_ID ? (
                                                    // If the update form is shown for this doctor, render nothing
                                                    null
                                                ) : (
                                                    // If the update form is not shown, render the "Update" button
                                                    <button
                                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                        onClick={() => handleUpdateButtonClick(data.Emp_ID)}
                                                    >
                                                        Update
                                                    </button>
                                                )}
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

export default Doctor;
