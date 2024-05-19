import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateInsurance from './CreateInsurance';
function Insurance({
    showCreateForm,
    setShowCreateForm,
    showUpdateForm,
    setShowUpdateForm,
    setSelectedInsuranceId,
}) {
    const [insurance, setInsurance] = useState([]);
const [deleteInsuranceId, setDeleteInsuranceId] = useState(null);
const [patients, setPatients] = useState([]);
const [searchQuery, setSearchQuery] = useState('');
const [filteredInsurance, setFilteredInsurance] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [recordsPerPage] = useState(7);

useEffect(() => {
    axios
        .get('http://localhost:9004/api/insurance')
        .then((res) => {
            console.log("Insurance data:", res.data);
            setInsurance(res.data);
            setFilteredInsurance(res.data);
        })
        .catch((err) => console.error('Error fetching insurance:', err));

        axios
        .get('http://localhost:9004/api/patient')
        .then((res) => {
            console.log("Patients data:", res.data);
            setPatients(res.data);
        })
        .catch((err) => console.error('Error fetching patients:', err));
}, []);



const handleUpdateButtonClick = (insuranceId) => {
    setSelectedInsuranceId(insuranceId);
    setShowUpdateForm((prevState) => prevState === insuranceId ? null : insuranceId);
    if (showCreateForm) {
        setShowCreateForm(false); 
    }
};

const handleDelete = (id) => {
    setDeleteInsuranceId(id);
};

const handleDeleteConfirm = async () => {
    try {
        await axios.delete(`http://localhost:9004/api/insurance/delete/${deleteInsuranceId}`);
        setInsurance(insurance.filter((data) => data.Policy_Number !== deleteInsuranceId));
        setFilteredInsurance(filteredInsurance.filter((data) => data.Policy_Number !== deleteInsuranceId));
        if (showCreateForm) {
            setShowCreateForm(false);
        }
        if (showUpdateForm) {
            setShowUpdateForm(false);
        }
    } catch (err) {
        console.error('Error deleting insurance:', err);
    }
    setDeleteInsuranceId(null);
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
    const filtered = insurance
        .filter((item) =>
            getPatientName(item.Patient_ID).toLowerCase().startsWith(searchQuery.toLowerCase())
        )
        .sort((a, b) => b.Policy_Number - a.Policy_Number); 

    setFilteredInsurance(filtered);
}, [searchQuery, insurance]);

// Logic to calculate current records for pagination
const indexOfLastRecord = currentPage * recordsPerPage; //1 * 10 = 10
const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;//10-10 = 0
const currentRecords = filteredInsurance.slice(indexOfFirstRecord, indexOfLastRecord);

// Change page
const paginate = pageNumber => {
    setCurrentPage(pageNumber);
};


const getPatientName = (patientId) => { 
    console.log("Patient ID:", patientId);
    console.log("Patients:", patients);

    const patient = patients.find(pat => pat.Patient_ID === patientId);
    console.log("Found Patient:", patient);

    if (patient) {
        return `${patient.Patient_Fname} ${patient.Patient_Lname}`;
    } else {
        return 'Unknown';
    }
};
        return (

            <div className="container-fluid mt-4">
                
                {/* Render Delete Confirmation Dialog */}
                {deleteInsuranceId && (
                    <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
                        <div className="bg-white p-8 mx-auto rounded-lg">
                            <h1 className="text-lg font-bold mb-4">Confirm Deletion</h1>
                            <p className="mb-4">Are you sure you want to delete this insurance record?</p>
                            <div className="flex justify-end">
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mr-2 rounded"
                                    onClick={handleDeleteConfirm}
                                >
                                    Delete
                                </button>
                                <button
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                    onClick={() => setDeleteInsuranceId(null)}
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
                            Add Insurance
                        </button>
                    </div>
                )}
        
                {/* Pagination buttons and Add Insurance button */}
                <div className="mt-4">
                    {/* Pagination buttons */}
                    {filteredInsurance.length > recordsPerPage && (
                        <div className="flex justify-end">
                        <div>
                            {currentPage > 1 && (
                                <button className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => paginate(currentPage - 1)}>Previous</button>
                            )}
                            {currentPage < Math.ceil(filteredInsurance.length / recordsPerPage) && (
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => paginate(currentPage + 1)}>Next</button>
                            )}
                        </div>
                        </div>
                    )}
                </div>
        
                {/* Render CreateInsurance component only when showCreateForm is true */}
                {showCreateForm && <CreateInsurance onClose={() => setShowCreateForm(false)} />}
        
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
                        <h2 className="text-2xl font-semibold leading-tight">Insurance</h2>
                        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                            <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                                <table className="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Patient</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ins. Code</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">End Date</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Provider</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Plan</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Co-Pay</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Coverage</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Maternity</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Dental</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Optical</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">(ID)</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Update</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentRecords.map((data, i) => (
                                            <tr key={i}>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{getPatientName(data.Patient_ID)}</td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Ins_Code}</td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.End_Date}</td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Provider}</td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Plan}</td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Co_Pay}</td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Coverage}</td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Maternity}</td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Dental}</td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Optical}</td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Policy_Number}</td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {showUpdateForm === data.Policy_Number ? (
                                                    // If the update form is shown for this medicine, render nothing
                                                    null
                                                ) : (
                                                    // If the update form is not shown, render the "Update" button
                                                    <button
                                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                        onClick={() => handleUpdateButtonClick(data.Policy_Number)}
                                                    >
                                                        Update
                                                    </button>
                                                )} 
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <button
                                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                                                        onClick={() => handleDelete(data.Policy_Number)}
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

export default Insurance;