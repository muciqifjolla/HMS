import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateMedicine from './CreateMedicine';
import Cookies from 'js-cookie'; // Import js-cookie
function Medicine({
    showCreateForm,
    setShowCreateForm,
    setShowUpdateForm,
    showUpdateForm,
    setSelectedMedicineId,
}) {
    const [medicine, setMedicine] = useState([]);
    const [deleteMedicineId, setDeleteMedicineId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMedicine, setFilteredMedicine] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(7);
    const token = Cookies.get('token');
    useEffect(() => {
        axios
            .get('http://localhost:9004/api/medicine',{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            
            .then((res) => {
                setMedicine(res.data);
                setFilteredMedicine(res.data);
            })
            .catch((err) => console.log(err));
    }, []);

    const handleUpdateButtonClick = (medicineId) => {
        setSelectedMedicineId(medicineId);
        setShowUpdateForm((prevState) => prevState === medicineId ? null : medicineId);
        if (showCreateForm) {
            setShowCreateForm(false); 
        }
    };

    const handleDelete = (id) => {
        setDeleteMedicineId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/medicine/delete/${deleteMedicineId}`);
            setMedicine(medicine.filter((item) => item.Medicine_ID !== deleteMedicineId));
            setFilteredMedicine(filteredMedicine.filter((item) => item.Medicine_ID !== deleteMedicineId));
            if (showCreateForm) {
                setShowCreateForm(false);
            }
            if(showUpdateForm){
                setShowUpdateForm(false);
            }
        } catch (err) {
            console.log(err);
        }
        setDeleteMedicineId(null);
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
        const filtered = medicine
            .filter((item) =>
                item.M_name.toLowerCase().startsWith(searchQuery.toLowerCase())
            )
            .sort((a, b) => b.Medicine_ID - a.Medicine_ID);
    
        setFilteredMedicine(filtered);
    
    }, [searchQuery, medicine, currentPage]);

    // Logic to calculate current records for pagination
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredMedicine.slice(indexOfFirstRecord, indexOfLastRecord);

    // Change page
    const paginate = pageNumber => {
        setCurrentPage(pageNumber);
    };
    return (
        <div className="container-fluid mt-4">
            {/* Render Delete Confirmation Dialog */}
            {deleteMedicineId && (
                <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
                    <div className="bg-white p-8 mx-auto rounded-lg">
                        <h1 className="text-lg font-bold mb-4">Confirm Deletion</h1>
                        <p className="mb-4">Are you sure you want to delete this medicine record?</p>
                        <div className="flex justify-end">
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mr-2 rounded"
                                onClick={handleDeleteConfirm}
                            >
                                Delete
                            </button>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                onClick={() => setDeleteMedicineId(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
    
            {/* Conditionally render the "Add Medicine" button or "Close" button based on showCreateForm */}
            {/* Add pagination controls */}
            {showCreateForm ? null : (
                <div className="mt-4">
                    <button
                        className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        style={{ borderRadius: '0.5rem' }}
                        onClick={handleCreateFormToggle}
                    >
                        Add Medicine
                    </button>
                </div>
            )}
    
            {/* Pagination buttons and Add Medicine button */}
            <div className="mt-4">
                {/* Pagination buttons */}
                {filteredMedicine.length > recordsPerPage && (
                    <div className="flex justify-end">
                        {currentPage > 1 && (
                            <button className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => paginate(currentPage - 1)}>Previous</button>
                        )}
                        {currentPage < Math.ceil(filteredMedicine.length / recordsPerPage) && (
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => paginate(currentPage + 1)}>Next</button>
                        )}
                    </div>
                )}
            </div>
    
            {/* Render CreateMedicine component only when showCreateForm is true */}
            {showCreateForm && <CreateMedicine onClose={() => setShowCreateForm(false)} />}
    
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
                    <h2 className="text-2xl font-semibold leading-tight">Medicine</h2>
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Quantity</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Cost (€)</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">(ID)</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Update</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentRecords.map((data, i) => (
                                        <tr key={i}>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.M_name}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.M_Quantity}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.M_Cost}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Medicine_ID}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {showUpdateForm === data.Medicine_ID ? (
                                                    // If the update form is shown for this medicine, render nothing
                                                    null
                                                ) : (
                                                    // If the update form is not shown, render the "Update" button
                                                    <button
                                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                        onClick={() => handleUpdateButtonClick(data.Medicine_ID)}
                                                    >
                                                        Update
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <button
                                                    className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                    onClick={() => handleDelete(data.Medicine_ID)}
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

export default Medicine;
