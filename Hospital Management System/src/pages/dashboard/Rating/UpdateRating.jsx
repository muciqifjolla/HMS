import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal'; // Ensure this component exists for error handling

function UpdateMedicine({ id }) {
    const [patient_ID, setPatient_ID] = useState('');
    const [emp_ID, setEmp_ID] = useState('');
    const [rating, setRating] = useState('');
    const [comments, setComments] = useState('');
    const [date, setDate] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/rating/${id}`);
                const data = response.data;
                setOriginalData(data);
                setPatient_ID(data.Patient_ID);
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
        setTimeout(() => {
            setAlertMessage('');
            setShowErrorModal(false);
        }, 3000);
    };

    const handleUpdateRating = async () => {
        // Basic validation
        if (
            patient_ID === originalData.Patient_ID &&
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
        if (!date.trim()) {
            showAlert("Date name cannot be empty.");
            return;
        }
        if (!rating || (rating<1 || rating>5)) {
            showAlert("Rating must be whith in 1-5.");
            return;
        }

        if (!patient_ID || patient_ID < 1) {
            showAlert("Patient ID must be at least 1.");
            return;
        }

        if (!emp_ID || emp_ID < 1) {
            showAlert("Employe ID must be at least 1.");
            return;
        }

        

        try {
            await axios.put(`http://localhost:9004/api/rating/update/${id}`, {
                Patient_ID: patient_ID,
                Emp_ID: emp_ID,
                Rating: rating,
                Comments: comments,
                Date: date,
            });

            navigate('/dashboard/rating')// Navigate to the medicines dashboard after updating
            window.location.reload(); // Refresh the page to show the updated data
        } catch (error) {
            console.error('Error updating rating:', error);
            showAlert('Error updating ra11ting. Please try again.');
        }
    };

    return (
        <div className="container mt-4">
            {showErrorModal && (
                <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
            )}
            <div className="bg-white rounded p-3">
                <div className="mb-2">
                    <label htmlFor="Patient ID">Patient ID:</label>
                    <input
                       type='number'
                       id='Patient ID'
                       name='Patient_ID'
                       placeholder='Enter Patient ID'
                       className='form-control'
                        value={patient_ID}
                        onChange={(e) => setPatient_ID(e.target.value)}
                    />
                </div>

                <div className="mb-2">
                    <label htmlFor="Staff ID">Emp_ID:</label>
                    <input
                        type='number'
                        id='Emp_ID'
                        name='Emp_ID'
                        placeholder='Enter Staff ID'
                        className='form-control'
                        value={emp_ID}
                        onChange={(e) => setEmp_ID(e.target.value)}
                    />
                </div>

                <div className='mb-2'>
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

                <div className="mb-2">
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

                <div className="mb-2">
                    <label htmlFor="Date">Date:</label>
                    <input
                         type='date'
                         id='date'
                         name='Date'
                         placeholder='Enter Date'
                         className='form-control'
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>


                <button type="button" className="btn btn-success" onClick={handleUpdateRating}>
                    Submit
                </button>
            </div>
        </div>
    );
}

export default UpdateMedicine;
