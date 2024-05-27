import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateAppointment from './CreateAppointment';
import Cookies from 'js-cookie'; // Import js-cookie
function Appointment({
    showCreateForm,
    setShowCreateForm,
    showUpdateForm,
    setShowUpdateForm,
    setSelectedAppointmentId,
}) {
const [appointment, setAppointment] = useState([]);
const [deleteAppointmentId, setDeleteAppointmentId] = useState(null);
const [patients, setPatients] = useState([]);
const [searchQuery, setSearchQuery] = useState('');
const [filteredAppointment, setFilteredAppointment] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [recordsPerPage] = useState(7);
// Retrieve the token from localStorage
const token = Cookies.get('token'); 

useEffect(() => {
    // Ensure the token is updated if it changes

    axios
        .get('http://localhost:9004/api/appointment', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((res) => {
            setAppointment(res.data);
            setFilteredAppointment(res.data);
        })
        .catch((err) => console.error('Error fetching appointment:', err));

    axios
        .get('http://localhost:9004/api/patient', {
            headers: {
                'Authorization': `Bearer ${token}` // Using token from cookies for patient data as well
            }
        })
        .then((res) => {
            setPatients(res.data);
        })
        .catch((err) => console.error('Error fetching patients:', err));

}, [token]);  // Add token to the dependency array to re-fetch when token changes




const handleUpdateButtonClick = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setShowUpdateForm((prevState) => prevState === appointmentId ? null : appointmentId);
    if (showCreateForm) {
        setShowCreateForm(false); 
    }
};

const handleDelete = (id) => {
    setDeleteAppointmentId(id);
};

const handleDeleteConfirm = async () => {
    try {
        await axios.delete(`http://localhost:9004/api/appointment/delete/${deleteAppointmentId}`);
        setAppointment(appointment.filter((item) => item.Appoint_ID !== deleteAppointmentId));
        setFilteredAppointment(filteredAppointment.filter((item) => item.Appoint_ID !== deleteAppointmentId));
        if (showCreateForm) {
            setShowCreateForm(false);
        }
        if(showUpdateForm){
            setShowUpdateForm(false);
        }
    } catch (err) {
        console.log(err);
    }
    setDeleteAppointmentId(null);
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

// {data.Patient.Patient_Fname}
useEffect(() => {
    const filtered = appointment.filter((item) =>
        (item.Patient.Patient_Fname.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
        item.Patient.Patient_Lname.toLowerCase().startsWith(searchQuery.toLowerCase()))
    ).sort((a, b) => b.Medicine_ID - a.Medicine_ID);

    setFilteredAppointment(filtered);
}, [searchQuery, appointment]);

// Logic to calculate current records for pagination
const indexOfLastRecord = currentPage * recordsPerPage; //1 * 10 = 10
const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;//10-10 = 0
const currentRecords = filteredAppointment.slice(indexOfFirstRecord, indexOfLastRecord);

// Change page
const paginate = pageNumber => {
    setCurrentPage(pageNumber);
};

     return (
           

            <div className="container-fluid mt-4">
                
                {/* Render Delete Confirmation Dialog */}
                {deleteAppointmentId && (
                    <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
                        <div className="bg-white p-8 mx-auto rounded-lg">
                            <h1 className="text-lg font-bold mb-4">Confirm Deletion</h1>
                            <p className="mb-4">Are you sure you want to delete this appointment record?</p>
                            <div className="flex justify-end">
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mr-2 rounded"
                                    onClick={handleDeleteConfirm}
                                >
                                    Delete
                                </button>
                                <button
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                    onClick={() => setDeleteAppointmentId(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        
                {/* Conditionally render the "Add Appointment" button or "Close" button based on showCreateForm */}
                {/* Add pagination controls */}
                {showCreateForm ? null : (
                    <div>
                        <button
                            className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            style={{ borderRadius: '0.5rem' }}
                            onClick={handleCreateFormToggle}
                        >
                            Add Appointment
                        </button>
                    </div>
                )}
        
                {/* Pagination buttons and Add Appointment button */}
                <div className="mt-4">
                    {/* Pagination buttons */}
                    {filteredAppointment.length > recordsPerPage && (
                        <div className="flex justify-end">
                        <div>
                            {currentPage > 1 && (
                                <button className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => paginate(currentPage - 1)}>Previous</button>
                            )}
                            {currentPage < Math.ceil(filteredAppointment.length / recordsPerPage) && (
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => paginate(currentPage + 1)}>Next</button>
                            )}
                        </div>
                        </div>
                    )}
                </div>
        
                {/* Render CreateAppointment component only when showCreateForm is true */}
                {showCreateForm && <CreateAppointment onClose={() => setShowCreateForm(false)} />}
        
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
                {/* Render Table */}
                <div className="table-responsive mt-4">
                    <div className="py-8">
                        <h2 className="text-2xl font-semibold leading-tight">Appointment</h2>
                        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                            <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                                <table className="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Appointment ID</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Patient</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Doctor</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Scheduled_On</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Time</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Update</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentRecords.map((data, i) => (
                                            <tr key={i}>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Appoint_ID}</td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Patient.Patient_Fname} {data.Patient.Patient_Lname}</td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Doctor.Staff.Emp_Fname} {data.Doctor.Staff.Emp_Lname}</td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Scheduled_On}</td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Date}</td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Time}</td>

                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {showUpdateForm === data.Appoint_ID ? (
                                                    // If the update form is shown for this medicine, render nothing
                                                    null
                                                ) : (
                                                    // If the update form is not shown, render the "Update" button
                                                    <button
                                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                        onClick={() => handleUpdateButtonClick(data.Appoint_ID)}
                                                    >
                                                        Update
                                                    </button>
                                                )} 
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <button
                                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                                                        onClick={() => handleDelete(data.Appoint_ID)}
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

export default Appointment;