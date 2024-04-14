import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Department({ showCreateForm, setShowCreateForm,showUpdateForm, setShowUpdateForm, setSelectedDepartmentIdId}) {
    
    const [department, setDepartment] = useState([]);


    const handleUpdateButtonClick = (departmentId) => {
        setSelectedDepartmentIdId(departmentId);
        setShowUpdateForm(!showUpdateForm);
    };
    

    useEffect(() => {
        axios.get('http://localhost:9004/api/department')
            .then(res => setDepartment(res.data))
            .catch(err => console.log(err));
    }, []);



    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:9004/api/department/delete/${id}`);
            setDepartment(department.filter(item => item.Dept_ID !== id));
        } catch (err) {
            console.log(err);
        }
    }



    return (
        <div className='container-fluid mt-4'>
    <h2 className="my-3">Department</h2>

    <button className='btn btn-success mb-3' style={{ borderRadius: '0.5rem' }} onClick={() => setShowCreateForm(!showCreateForm)}>
        {showCreateForm ? 'Close Add Form' : 'Add +'}
    </button>

    <div className="table-responsive">
        <div className="py-8">
            <div>
                <h2 className="text-2xl font-semibold leading-tight">Department</h2>
            </div>
            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Department Head</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Department Name</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Emp_Count</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Update</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {department.map((data, i) => (
                                <tr key={i}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm" >{data.Dept_head}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Dept_name}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Emp_Count}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleUpdateButtonClick(data.Dept_ID)}>
                                            {showUpdateForm ? 'Close Update Form' : 'Update'}
                                        </button>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <button className='bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => handleDelete(data.Dept_ID)} style={{ borderRadius: '0.5rem', padding: '5px 10px' }}>Delete</button>
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

export default Department;
