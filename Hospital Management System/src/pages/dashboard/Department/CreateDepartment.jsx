import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateDepartment() {

    
    const [dept_head, setDept_head] = useState('');
    const [dept_name, setDept_name] = useState('');
    const [emp_Count, setEmp_Count] = useState('');
    const navigate = useNavigate();


    const handleAddDepartment = async () => {
        try {
    
            await axios.post("http://localhost:9004/api/department/create", {
                Dept_head: dept_head,
                Dept_name: dept_name,
                Emp_Count: emp_Count,
            });
            setDept_head('');
            setDept_name('');
            setEmp_Count('');

            navigate('/dashboard/department', { replace: true });
            
            window.location.reload();

        } catch (error) {
            console.error('Error adding Department:', error);
        }
    };


    return (
        <div className='container mt-4'>
            <div className='bg-white rounded p-3'>
                <div className='mb-2'>
                    <label htmlFor="dept_head">Department Head  </label>
                    <input type='text' id="dept_head" placeholder='Enter Dept Head' className='form-control'
                        value={dept_head} onChange={e => setDept_head(e.target.value)} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="dept_name">Department Name  </label>
                    <input type='text' id="dept_name" placeholder='Enter Dept Name' className='form-control'
                        value={dept_name} onChange={e => setDept_name(e.target.value)} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="emp_Count">Employee Count </label>
                    <input type='number' id="emp_Count" placeholder='Enter Employee Count' className='form-control'
                        value={emp_Count} onChange={e => setEmp_Count(e.target.value)} />
                </div>
                
                <button type="button" className='btn btn-success' onClick={handleAddDepartment }>Submit</button>
            </div>
        </div>
    );
}

export default CreateDepartment;
