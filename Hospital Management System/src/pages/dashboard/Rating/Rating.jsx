import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateRating from './CreateRating';
function Rating({
    showCreateForm,
    setShowCreateForm,
    showUpdateForm,
    setShowUpdateForm,
    setSelectedRatingId,
}) {
    const [rating, setRating] = useState([]);
    const [deleteRatingId, setDeleteRatingId] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRating, setFilteredRating] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(7);
    const token = sessionStorage.getItem('token'); 
    // Fetch ratings and employees data
    useEffect(() => {
        axios
            .get('http://localhost:9004/api/rating',{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((res) => setRating(res.data))
            .catch((err) => console.log(err));

        axios
            .get('http://localhost:9004/api/staff')
            .then((res) => setEmployees(res.data))
            .catch((err) => console.log(err));
    }, []);

    // Event handler for updating rating
    const handleUpdateButtonClick = (ratingId) => {
        setSelectedRatingId(ratingId);
        setShowUpdateForm((prevState) => prevState === ratingId ? null : ratingId);
        if (showCreateForm) {
            setShowCreateForm(false); // Close create form if open
        }
    };

    // Event handler for deleting rating
    const handleDelete = (id) => {
        setDeleteRatingId(id);
    };

    // Function to format date
    function formatDate(dateString) {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    }

    // Event handler for confirming deletion
    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/rating/delete/${deleteRatingId}`);
            setRating(rating.filter((item) => item.Rating_ID !== deleteRatingId));
            if (showUpdateForm) {
                setShowUpdateForm(false);
            }
            if (showCreateForm) {
                setShowCreateForm(false);
            }
        } catch (err) {
            console.log(err);
        }
        setDeleteRatingId(null);
    };

    // Event handler for toggling create form
    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false); // Ensure update form is closed
    };

    // Function to get employee name by ID
    const getEmployeeName = (empId) => {
        const employee = employees.find(emp => emp.Emp_ID === empId);
        if (employee) {
            return `${employee.Emp_Fname} ${employee.Emp_Lname}`;
        } else {
            return 'Unknown';
        }
    };

    // Event handler for handling search input change
    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset currentPage to 1 when the search query changes
    };
    

    // Filter ratings based on search query
    useEffect(() => {
        const filtered = rating
            .filter((item) =>
                getEmployeeName(item.Emp_ID).toLowerCase().startsWith(searchQuery.toLowerCase())
            )
            .sort((a, b) => b.Rating_ID - a.Rating_ID); 

        setFilteredRating(filtered);
    }, [searchQuery, rating]);

    // Logic for pagination
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredRating.slice(indexOfFirstRecord, indexOfLastRecord);

    // Function to change page
    const paginate = pageNumber => {
        setCurrentPage(pageNumber);
    };
    

    
    return (
        <div className="container-fluid mt-4">
    {/* Render Delete Confirmation Dialog */}
    {deleteRatingId && (
        <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <div className="bg-white p-8 mx-auto rounded-lg">
                <h1 className="text-lg font-bold mb-4">Confirm Deletion</h1>
                <p className="mb-4">Are you sure you want to delete this rating record?</p>
                <div className="flex justify-end">
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mr-2 rounded"
                        onClick={handleDeleteConfirm}
                    >
                        Delete
                    </button>
                    <button
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                        onClick={() => setDeleteRatingId(null)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )}

    {/* Conditionally render the "Add Rating" button or "Close" button based on showCreateForm */}
    {/* Add pagination controls */}
    {showCreateForm ? null : (
        <div>
            <button
                className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                style={{ borderRadius: '0.5rem' }}
                onClick={handleCreateFormToggle}
            >
                Add Rating
            </button>
        </div>
    )}

    {/* Pagination buttons and Add Rating button */}
    <div className="mt-4">
        {/* Pagination buttons */}
        {filteredRating.length > recordsPerPage && (
            <div className="flex justify-end">
            <div>
                {currentPage > 1 && (
                    <button className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => paginate(currentPage - 1)}>Previous</button>
                )}
                {currentPage < Math.ceil(filteredRating.length / recordsPerPage) && (
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => paginate(currentPage + 1)}>Next</button>
                )}
            </div>
            </div>
        )}
    </div>

    {/* Render CreateRating component only when showCreateForm is true */}
    {showCreateForm && <CreateRating onClose={() => setShowCreateForm(false)} />}

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
            <h2 className="text-2xl font-semibold leading-tight">Rating</h2>
            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Employee</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rating(1-5)</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Comments</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">(ID)</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Update</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.map((data, i) => (
                                <tr key={i}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{getEmployeeName(data.Emp_ID)}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Rating}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Comments}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{formatDate(data.Date)}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Rating_ID}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {showUpdateForm === data.Rating_ID ? (
                                                    // If the update form is shown for this medicine, render nothing
                                                    null
                                                ) : (
                                                    // If the update form is not shown, render the "Update" button
                                                    <button
                                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                        onClick={() => handleUpdateButtonClick(data.Rating_ID)}
                                                    >
                                                        Update
                                                    </button>
                                                )}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <button
                                            className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            onClick={() => handleDelete(data.Rating_ID)}
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

export default Rating;
