import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateBill from './CreateBill';


function Bill({
    showCreateForm,
    setShowCreateForm,
    showUpdateForm,
    setShowUpdateForm,
    setSelectedBillId,
}) {
    const [bill, setBill] = useState([]);
    const [deleteBillId, setDeleteBillId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBill, setFilteredBill] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(7);
    const token = sessionStorage.getItem('token'); // Retrieve the token from localStorage


    useEffect(() => {
        axios
            .get('http://localhost:9004/api/bills',
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            )
            .then((res) => {
                setBill(res.data);
                setFilteredBill(res.data);
            })
            .catch((err) => console.error('Error fetching bill:', err));

    }, []);

    const handleUpdateButtonClick = (billId) => {
        setSelectedBillId(billId);
        setShowUpdateForm((prevState) => prevState === billId ? null : billId);
        if (showCreateForm) {
            setShowCreateForm(false); 
        }
    };

    const handleDelete = (id) => {
        setDeleteBillId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/bills/delete/${deleteBillId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            );
            setBill(bill.filter((data) => data.Payment_ID !== deleteBillId));
            setFilteredBill(filteredBill.filter((data) => data.Payment_ID !== deleteBillId));
            if (showCreateForm) {
                setShowCreateForm(false);
            }
            if (showUpdateForm) {
                setShowUpdateForm(false);
            }
        } catch (err) {
            console.error('Error deleting bill:', err);
        }
        setDeleteBillId(null);
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
        const filtered = bill
            .filter((item) =>
                item.Patient.Patient_Fname.toLowerCase().startsWith(searchQuery.toLowerCase())
            )
            .sort((a, b) => b.Payment_ID - a.Payment_ID); 

        setFilteredBill(filtered);
    }, [searchQuery, bill , currentPage]);


   

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredBill.slice(indexOfFirstRecord, indexOfLastRecord);

    const paginate = pageNumber => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container-fluid mt-4">
            {/* Render Delete Confirmation Dialog */}
            {deleteBillId && (
                <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
                    <div className="bg-white p-8 mx-auto rounded-lg">
                        <h1 className="text-lg font-bold mb-4">Confirm Deletion</h1>
                        <p className="mb-4">Are you sure you want to delete this bill record?</p>
                        <div className="flex justify-end">
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mr-2 rounded"
                                onClick={handleDeleteConfirm}
                            >
                                Delete
                            </button>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                onClick={() => setDeleteBillId(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Conditionally render the "Add Bill" button or "Close" button based on showCreateForm */}
            {showCreateForm ? null : (
                <div>
                    <button
                        className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        style={{ borderRadius: '0.5rem' }}
                        onClick={handleCreateFormToggle}
                    >
                        Add Bill
                    </button>
                </div>
            )}
        
            {/* Pagination buttons and Add Bill button */}
            <div className="mt-4">
                {/* Pagination buttons */}
                {filteredBill.length > recordsPerPage && (
                    <div className="flex justify-end">
                        <div>
                            {currentPage > 1 && (
                                <button className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => paginate(currentPage - 1)}>Previous</button>
                            )}
                            {currentPage < Math.ceil(filteredBill.length / recordsPerPage) && (
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => paginate(currentPage + 1)}>Next</button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        
            {/* Render CreateBill component only when showCreateForm is true */}
            {showCreateForm && <CreateBill onClose={() => setShowCreateForm(false)} />}
        
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
                <h2 className="text-2xl font-semibold leading-tight">Bill</h2>
                <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                    <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Bill ID</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Patient</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Room ID</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Medicine</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">DATE</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Room_cost</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Other_charges</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">M_Cost</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Update</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRecords.map((data, i) => (
                                    <tr key={i}>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Payment_ID}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Patient.Patient_Fname} {data.Patient.Patient_Lname}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Room.Room_type}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Medicine.Medicine_ID}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.DATE}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Room.Room_cost}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Other_charges}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Medicine.M_Cost}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Total}</td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {showUpdateForm === data.Payment_ID ? null : (
                                                <button
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                    onClick={() => handleUpdateButtonClick(data.Payment_ID)}
                                                >
                                                    Update
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <button
                                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                                                onClick={() => handleDelete(data.Payment_ID)}
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

export default Bill;
