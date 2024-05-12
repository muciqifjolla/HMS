import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

    const handleUpdateButtonClick = (ratingId) => {
        setSelectedRatingId(ratingId);
        setShowUpdateForm((prevState) => prevState === ratingId ? null : ratingId);
        if (showCreateForm) {
            setShowCreateForm(false); // Close create form if open
        }
    };

    useEffect(() => {
        axios
            .get('http://localhost:9004/api/rating')
            .then((res) => setRating(res.data))
            .catch((err) => console.log(err));
        

            
        // Fetch employee data
        axios
            .get('http://localhost:9004/api/staff')
            .then((res) => setEmployees(res.data))
            .catch((err) => console.log(err));

      
    }, []);

    const handleDelete = (id) => {
        setDeleteRatingId(id);
    };

    function calculateDaysLeft(targetDate) {
        const currentDate = new Date();
        const target = new Date(targetDate);
        const differenceMs = target - currentDate;
        const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
        return differenceDays;
    }

    function formatDate(dateString) {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', options);
        return `${formattedDate}`;
    }

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

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false); // Ensure update form is closed
    };

    // Function to get employee name by ID
    const getEmployeeName = (empId) => {
        console.log("Employee ID:", empId);
        console.log("Employees:", employees);
    
        const employee = employees.find(emp => emp.id === empId);
        console.log("Found Employee:", employee);
    
        if (employee) {
            return `${employee.Emp_Fname} ${employee.Emp_Lname}`;
        } else {
            return 'Unknown';
        }
    };
    
    return (
        <div className="container-fluid mt-4">
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

            <button
                className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                style={{ borderRadius: '0.5rem' }}
                onClick={handleCreateFormToggle}
            >
                {showCreateForm ? 'Close' : 'Add Rating'}
            </button>

            <div className="table-responsive">
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
                                    {rating.map((data, i) => (
                                        <tr key={i}>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{getEmployeeName(data.Emp_Fname)}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Rating}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Comments}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{formatDate(data.Date)}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Rating_ID}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <button
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                    onClick={() => handleUpdateButtonClick(data.Rating_ID)}
                                                >
                                                    {showUpdateForm === data.Rating_ID ? 'Close' : 'Update'}
                                                </button>
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
