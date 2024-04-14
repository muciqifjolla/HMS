import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UpdateDepartment({id}) {


    const navigate = useNavigate();
    const [dept_head, setDept_head] = useState('');
    const [dept_name, setDept_name] = useState('');
    const [emp_Count, setEmp_Count] = useState('');

    console.log(dept_head);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/department/${id}`);

                setDept_head(response.data.Dept_head);
                setDept_name(response.data.Dept_name);
                setEmp_Count(response.data.Emp_Count);

            } catch (error) {
                console.error('Error fetching department:', error);
            }
        };

        fetchData();
    }, []);


    const handleUpdateDepartment = async () => {
        
        try {

            await axios.put(`http://localhost:9004/api/department/update/${id}`, {  
                Dept_head: dept_head,
                Dept_name: dept_name,
                Emp_Count: emp_Count,
        });
        setDept_head(dept_head);
        setDept_name(dept_name);
        setEmp_Count(emp_Count);


            navigate('/dashboard/departments');
            window.location.reload();
        } catch (error) {
            console.error('Error updating department:', error);
        }
    };

    
    return (
        <div className='bg-white rounded p-3'>
        <div className='mb-2'>
            <label htmlFor="dept_head">Department Head</label>
            <input type='text' id="dept_head" placeholder='Enter Dept Head' className='form-control'
                value={dept_head} onChange={e => setDept_head(e.target.value)} />
        </div>

        <div className='mb-2'>
            <label htmlFor="dept_name">Department Name </label>
            <input type='text' id="dept_name" placeholder='Enter Dept Name' className='form-control'
                value={dept_name} onChange={e => setDept_name(e.target.value)} />
        </div>

        <div className='mb-2'>
            <label htmlFor="emp_Count">Employee Count</label>
            <input type='number' id="emp_Count" placeholder='Enter Employee count' className='form-control'
                value={emp_Count} onChange={e => setEmp_Count(e.target.value)} />
        </div>


       
        <button type="button" className='btn btn-success' onClick={handleUpdateDepartment }>Submit</button>
    </div>
    
    );

}

export default UpdateDepartment;