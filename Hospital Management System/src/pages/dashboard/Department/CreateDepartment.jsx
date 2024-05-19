import axios from 'axios';
import React, { useState, useEffect } from 'react'; // Added useEffect
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';

function CreateDepartment({ onClose }) {
    const [formData, setFormData] = useState({
        Dept_head: '',
        Dept_name: '',
        Emp_Count: '',
    });

    const [departments, setDepartments] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/department');
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

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
            window.location.reload();
        } catch (error) {
            console.error('Error adding Department:', error);
            setAlertMessage('Error adding Department. Please try again.');   
        }
    };

    const handleValidation = () => {
        const { Dept_head, Dept_name, Emp_Count } = formData;

        if (!Dept_head.trim() || !Dept_name.trim() || !Emp_Count ==='') {
            showAlert('All fields are required');
            return;
        }
        if (Dept_head.length < 2) {
            showAlert('Head can not be less than 1');
            return;
        }
        if (Dept_name.length < 2) {
            showAlert('Name can not be less than 1');
            return;
        }
        if (Emp_Count < 1) {
            showAlert('employee can not be less than 1');
            return;
        }

        const existingDepartment = departments.find(department => department.Dept_head === Dept_head);
        if (existingDepartment) {
            showAlert('Department with the same head already exists');
            return;
        }

        handleAddDepartment();
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <div className="bg-white p-8 mx-auto rounded-lg w-96">
                {showErrorModal && (
                    <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
                )}
                <h1 className="text-lg font-bold mb-4">Add Department</h1>
                
                    <div className='mb-4'>
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
                    <div className='mb-4'>
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
                    <div className='mb-4'>
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
                    <div className="flex justify-end">
                        <button
                            className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleValidation}
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

export default CreateDepartment;
