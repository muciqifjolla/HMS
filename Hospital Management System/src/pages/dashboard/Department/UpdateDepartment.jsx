import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ErrorModal from '../../../components/ErrorModal';

function UpdateDepartment({ id, onClose }) {
    const [dept_head, setDept_head] = useState('');
    const [dept_name, setDept_name] = useState('');
    const [emp_Count, setEmp_Count] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const [department, setDepartments] = useState([]);

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

    useEffect(() => {
        const fetchAllDepartments = async () => {
            try {
                const response = await axios.get('http://localhost:9004/api/department');
                setDepartments(response.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };

        fetchAllDepartments();
    }, []);

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    const handleUpdateDepartment = async () => {
        // Basic validation
        if (
            dept_head === originalData.Dept_head &&
            dept_name === originalData.Dept_name &&
            emp_Count === originalData.Emp_Count
        ) {
            showAlert('Data must be changed before updating.');
            return;
        }

        if (!dept_head.trim()) {
            showAlert("Department head cannot be empty.");
            return;
        }

        if (!dept_name.trim()) {
            showAlert("Department name cannot be empty.");
            return;
        }

        if (!emp_Count || emp_Count < 1) {
            showAlert("Employee count must be at least 1.");
            return;
        }

        // Check if department with the same name already exists
        const existingDepartment = department.find(dep => dep.Dept_name === dept_name && dep.Dept_ID !== id);
        if (existingDepartment) {
            showAlert('Department with the same name already exists.');
            return;
        }

        try {
            await axios.put(`http://localhost:9004/api/department/update/${id}`, {  
                Dept_head: dept_head,
                Dept_name: dept_name,
                Emp_Count: emp_Count,
            });

            // Close the modal after updating
            window.location.reload(); // Refresh the page to show the updated data
        } catch (error) {
            console.error('Error updating department:', error);
            showAlert('Error updating department. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <div className="bg-white p-8 mx-auto rounded-lg w-96">
                {showErrorModal && (
                    <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
                )}
                <h1 className="text-lg font-bold mb-4">Update Department</h1>
                <div className='mb-4'>
                    <label htmlFor="dept_head">Department Head:</label>
                    <input
                        type='text'
                        id='dept_head'
                        name='dept_head'
                        placeholder='Enter Department Head'
                        className='form-control'
                        value={dept_head}
                        onChange={(e) => setDept_head(e.target.value)}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor="dept_name">Department Name:</label>
                    <input
                        type='text'
                        id='dept_name'
                        name='dept_name'
                        placeholder='Enter Department Name'
                        className='form-control'
                        value={dept_name}
                        onChange={(e) => setDept_name(e.target.value)}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor="emp_Count">Employee Count:</label>
                    <input
                        type='number'
                        id='emp_Count'
                        name='emp_Count'
                        placeholder='Enter Employee Count'
                        className='form-control'
                        value={emp_Count}
                        onChange={(e) => setEmp_Count(e.target.value)}
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleUpdateDepartment}
                    >
                        Submit
                    </button>
                    <button
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 ml-2 rounded"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UpdateDepartment;
