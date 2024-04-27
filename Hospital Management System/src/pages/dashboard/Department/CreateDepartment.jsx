import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';

function CreateDepartment() {
    const [formData, setFormData] = useState({
        Dept_head: '',
        Dept_name: '',
        Emp_Count: '',
    });

    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };


    const handleAddDepartment = async () => {
        try {
            await axios.post('http://localhost:9004/api/department/create', formData);
            navigate('/dashboard/department');
            window.location.reload(); // Refresh the page after successful submission
        } catch (error) {
            console.error('Error adding Department:', error);
            setAlertMessage('Error adding Department. Please try again.');   
        }
    };

    const handleValidation = () => {
        const { Dept_head, Dept_name, Emp_Count } = formData;

        // Ensure all required fields are filled
        if (!Dept_head.trim() || Dept_name ==='' || Emp_Count === '') {
            showAlert('All fields are required');
            return;
        }
        if(Emp_Count < 1){
            showAlert('Count can not be less than 1');
            return;
        }

        // Proceed with form submission after successful validation
        handleAddDepartment();
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
        // Automatically hide the error modal after 3 seconds
        setTimeout(() => {
            setAlertMessage('');
            setShowErrorModal(false);
        }, 3000);
    };


    return (
        <div className='container mt-4'>
            {showErrorModal && (
                <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
            )}
            <div className='bg-white rounded p-3'>
                <div className='mb-2'>
                    <label htmlFor="dept_head">Department Head:  </label>
                    <input
                        type='text'
                        id='dept_head'
                        name='Dept_head'
                        placeholder='Enter Department Head'
                        className='form-control'
                        value={formData.Dept_head}
                        onChange={handleChange}
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor="dept_name">Department Name:  </label>
                    <input
                        type='text'
                        id='dept_name'
                        name='Dept_name'
                        placeholder='Enter Department Name'
                        className='form-control'
                        value={formData.Dept_name}
                        onChange={handleChange}
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor="emp_Count">Employee Count: </label>
                    <input
                        type='number'
                        id='emp_Count'
                        name='Emp_Count'
                        placeholder='Enter Employee Count;'
                        className='form-control'
                        value={formData.Emp_Count}
                        onChange={handleChange}
                    />
                </div>
                
                <button 
                    type='button'
                    className='btn btn-success' 
                    onClick={handleValidation}
                    >
                    Submit
                </button>
            </div>
        </div>
    );
}

export default CreateDepartment;
