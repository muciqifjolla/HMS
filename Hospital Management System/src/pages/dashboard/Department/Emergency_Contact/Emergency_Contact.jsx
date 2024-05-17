import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateEmergencyContact from './CreateEmergency_Contact';
function Emergency_Contact({
    showCreateForm,
    setShowCreateForm,
    showUpdateForm,
    setShowUpdateForm,
    setSelectedEmergency_ContactId
}) {
    const [emergencyContacts, setEmergencyContacts] = useState([]);
const [deleteContactId, setDeleteContactId] = useState(null);
const [patients, setPatients] = useState([]);
const [searchQuery, setSearchQuery] = useState('');
const [filteredContacts, setFilteredContacts] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [recordsPerPage] = useState(10);

useEffect(() => {
    axios
        .get('http://localhost:9004/api/emergency_contact')
        .then((res) => {
            console.log("Emergency Contacts data:", res.data);
            setEmergencyContacts(res.data);
            setFilteredContacts(res.data); // Initialize filteredContacts with all emergency contacts
        })
        .catch((err) => console.error('Error fetching emergency contacts:', err));

    axios
        .get('http://localhost:9004/api/patient')
        .then((res) => {
            console.log("Patients data:", res.data);
            setPatients(res.data);
        })
        .catch((err) => console.error('Error fetching patients:', err));
}, []);

const handleUpdateButtonClick = (contactId) => {
    setSelectedEmergency_ContactId(contactId);
    setShowUpdateForm((prevState) => prevState === contactId ? null : contactId);
    if (showCreateForm) {
        setShowCreateForm(false); // Close create form if open
    }
};

const handleDelete = (id) => {
    setDeleteContactId(id);
};

const handleDeleteConfirm = async () => {
    try {
        await axios.delete(`http://localhost:9004/api/emergency_contact/delete/${deleteContactId}`);
        setEmergencyContacts(emergencyContacts.filter((contact) => contact.Contact_ID !== deleteContactId));
        setFilteredContacts(filteredContacts.filter((contact) => contact.Contact_ID !== deleteContactId)); // Update filteredContacts
        // Close the update form if open
        if (showUpdateForm) {
            setShowUpdateForm(false);
        }
        // Close the create form if open
        if (showCreateForm) {
            setShowCreateForm(false);
        }
    } catch (err) {
        console.error('Error deleting emergency contact:', err);
    }
    setDeleteContactId(null);
};

const handleCreateFormToggle = () => {
    setShowCreateForm(!showCreateForm);
    setShowUpdateForm(false); // Ensure update form is closed
};

const handleCloseCreateForm = () => {
    setShowCreateForm(false); 
};

const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset currentPage to 1 when the search query changes
};

useEffect(() => {
    const filtered = emergencyContacts
        .filter((contact) =>
            getPatientName(contact.Patient_ID).toLowerCase().startsWith(searchQuery.toLowerCase())
        )
        .sort((a, b) => b.Contact_ID - a.Contact_ID); 
    setFilteredContacts(filtered);
}, [searchQuery, emergencyContacts]);

// Logic to calculate current records for pagination
const indexOfLastRecord = currentPage * recordsPerPage;
const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
const currentRecords = filteredContacts.slice(indexOfFirstRecord, indexOfLastRecord);

// Change page
const paginate = pageNumber => {
    setCurrentPage(pageNumber);
};

const getPatientName = (patientId) => { 
    console.log("Patient ID:", patientId);
    console.log("Patients:", patients);

    const patient = patients.find(pat => pat.Patient_ID === patientId);
    // console.log("Found Patient:", patient);

    if (patient) {
        return `${patient.Patient_Fname} ${patient.Patient_Lname}`;
    } else {
        return 'Unknown';
    }
};

    return (
        <div className="container-fluid mt-4">
        {/* Render Delete Confirmation Dialog */}
        {deleteContactId && (
            <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
                <div className="bg-white p-8 mx-auto rounded-lg">
                    <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
                    <p>Are you sure you want to delete this emergency contact?</p>
                    <div className="flex justify-end">
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mr-2 rounded"
                            onClick={handleDeleteConfirm}
                        >
                            Delete
                        </button>
                        <button
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                            onClick={() => setDeleteContactId(null)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )}
    
        {/* Conditionally render the "Add Emergency Contact" button or "Close" button based on showCreateForm */}
        {/* Add pagination controls */}
        {showCreateForm ? null : (
            <div>
                <button
                    className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    style={{ borderRadius: '0.5rem' }}
                    onClick={handleCreateFormToggle}
                >
                    Add Emergency Contact
                </button>
            </div>
        )}
    
        {/* Pagination buttons */}
        <div className="mt-4">
            {filteredContacts.length > recordsPerPage && (
                <div className="flex justify-end">
                    <div>
                        {currentPage > 1 && (
                            <button className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => paginate(currentPage - 1)}>Previous</button>
                        )}
                        {currentPage < Math.ceil(filteredContacts.length / recordsPerPage) && (
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => paginate(currentPage + 1)}>Next</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    
        {/* Render CreateEmergencyContact component only when showCreateForm is true */}
        {showCreateForm && <CreateEmergencyContact onClose={() => setShowCreateForm(false)} />}
    
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
                <h2 className="text-2xl font-semibold leading-tight">Emergency Contacts</h2>
                <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                    <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Phone</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Relation</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Patient</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">(ID)</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Update</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRecords.map((data, i) => (
                                    <tr key={i}>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Contact_Name}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Phone}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Relation}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{getPatientName(data.Patient_ID)}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Contact_ID}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {showUpdateForm === data.Contact_ID ? (
                                                null
                                            ) : (
                                                <button
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                    onClick={() => handleUpdateButtonClick(data.Contact_ID)}
                                                >
                                                    Update
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <button
                                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                                                onClick={() => handleDelete(data.Contact_ID)}
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

export default Emergency_Contact;
