import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal'; // Ensure this component exists for error handling

function UpdateDepartment({id}) {
    const [dept_head, setDept_head] = useState('');
    const [dept_name, setDept_name] = useState('');
    const [emp_Count, setEmp_Count] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/department/${id}`);
                const data = response.data;
                setOriginalData(data);
                setDept_head(data.Dept_head);
                setDept_name(data.Dept_name);
                setEmp_Count(data.Emp_Count);

            } catch (error) {
                console.error('Error fetching department:', error);
                showAlert('Error fetching department details.');
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

    const handleUpdateDepartment = async () => {
        // Basic validation
        if (!dept_head.trim()) {
            showAlert("Department head cannot be empty.");
            return;
        }

        if (!dept_name.trim()) {
            showAlert("Department name cannot be empty.");
            return;
        }

        if (!emp_Count || emp_Count < 1) {
            showAlert("Count must be at least 1.");
            return;
        }

        // Ensure there are changes to update
        if (
            dept_head === originalData.Dept_head &&
            dept_name=== originalData.Dept_name&&
            emp_Count === originalData.Emp_Count
        ) {
            showAlert("Data must be changed before updating.");
            return;
        }




        try {

            await axios.put(`http://localhost:9004/api/department/update/${id}`, {  
                Dept_head: dept_head,
                Dept_name: dept_name,
                Emp_Count: emp_Count,
        });
 
            navigate('/dashboard/department'); // Navigate to the medicines dashboard after updating
            window.location.reload(); // Refresh the page to show the updated data
        } catch (error) {
            console.error('Error updating department:', error);
            showAlert('Error updating department. Please try again.');
        }
    };

    
    return (
        <div className="container mt-4">
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
                        value={dept_head}
                        onChange={(e) => setDept_head(e.target.value)}
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor="dept_name">Department Name:  </label>
                    <input
                         type='text'
                         id='dept_name'
                         name='Dept_name'
                         placeholder='Enter Department Head'
                         className='form-control'
                         value={dept_name}
                         onChange={(e) => setDept_name(e.target.value)}
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
                        value={emp_Count}
                        onChange={(e) => setEmp_Count(e.target.value)}
                    />
                </div>
                
                <button 
                    type="button"
                    className='btn btn-success' 
                    onClick={handleUpdateDepartment}
                    >
                    Submit
                </button>
            </div>
    </div>
    
    );

}

export default UpdateDepartment;