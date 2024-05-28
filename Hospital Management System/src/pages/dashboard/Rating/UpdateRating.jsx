import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal'; // Ensure this component exists for error handling
import Cookies from 'js-cookie'; // Import js-cookie
function UpdateRating({ id, onClose}) {
    const [emp_ID, setEmp_ID] = useState('');
    const [rating, setRating] = useState('');
    const [comments, setComments] = useState('');
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // Default to today's date
    const [originalData, setOriginalData] = useState({});
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get('token'); 
    const [staff, setStaff] = useState([]);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/staff', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setStaff(response.data);
        } catch (error) {
            console.error('Error fetching staff:', error);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/rating/${id}`,{
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                const data = response.data;
                setOriginalData(data);
                setEmp_ID(data.Emp_ID);
                setRating(data.Rating);
                setComments(data.Comments);
                setDate(data.Date);
            } catch (error) {
                console.error('Error fetching rating:', error);
                showAlert('Error fetching rating details.');
            }
        };

        fetchData();
    }, [id]);

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);

    };

    const handleUpdateRating = async () => {
        // Basic validation
        if (
            emp_ID === originalData.Emp_ID &&
            rating === originalData.Rating &&
            comments === originalData.Comments &&
            date === originalData.Date
        ) {
            showAlert("Data must be changed before updating.");
            return;
        }
        if (!comments.trim()) {
            showAlert("Comment name cannot be empty.");
            return;
        }
        if (!rating || (rating<1 || rating>5)) {
            showAlert("Rating must be within 1-5.");
            return;
        }
        if (!emp_ID || emp_ID < 1) {
            showAlert("Employee ID must be at least 1.");
            return;
        }
        if(comments.length>30){
            showAlert('Limit of characters reached(30)');
            return;
        }


        try {
            const currentDate = new Date().toISOString().slice(0, 10); // Get current date
            await axios.put(`http://localhost:9004/api/rating/update/${id}`, {
                Emp_ID: emp_ID,
                Rating: rating,
                Comments: comments,
                Date: currentDate, // Update to current date
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            navigate('/dashboard/rating'); // Navigate to the medicines dashboard after updating
            window.location.reload(); // Refresh the page to show the updated data
        } catch (error) {
            console.error('Error updating rating:', error);
            showAlert('Error updating rating. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
        <div className="bg-white p-8 mx-auto rounded-lg w-96">
            {showErrorModal && (
                <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
            )}
            <h1 className="text-lg font-bold mb-4">Update Rating</h1>
                <div className="mb-4">
                    <label htmlFor="Staff ID">Employee:</label>
                    <select
                        type='number'
                        id='Emp_ID'
                        name='Emp_ID'
                        placeholder='Enter Staff ID'
                        className='form-control'
                        value={emp_ID}
                        onChange={(e) => setEmp_ID(e.target.value)}
                        disabled
                    >
                        <option value=''>Select</option>
                        {staff.map(staffs => (
                            <option key={staffs.Emp_ID} value={staffs.Emp_ID}>
                                {`${staffs.Emp_Fname} ${staffs.Emp_Lname}`}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='mb-4'>
                <label htmlFor='Rating'>Rating:</label>
                <select
                    type='number'
                    id='Rating'
                    name='M_Cost'
                    className='form-control'
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                >
                    <option value='' disabled>Select Rating</option>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                    <option value='5'>5</option>
                </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="Comments">Comments:</label>
                    <input
                        type='text'
                        id='comments'
                        name='Comment'
                        placeholder='Enter Comment'
                        className='form-control'
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="Date">Date:</label>
                    <input
                         type='date'
                         id='date'
                         name='Date'
                         placeholder='Enter Date'
                         className='form-control'
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        disabled // Disable user input for date
                    />
                </div>


                <div className="flex justify-end">
                <button type="button" className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleUpdateRating}>
                    Submit
                </button>
                <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 ml-2 rounded"
                    onClick={onClose} // Call the onClose function passed from props
                >
                    Cancel
                </button>
            </div>
            </div>
        </div>

    );
}

export default UpdateRating;
