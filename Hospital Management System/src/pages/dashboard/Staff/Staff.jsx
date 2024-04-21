import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Staff({ showCreateForm, setShowCreateForm,showUpdateForm, setShowUpdateForm, setSelectedStaffIdId}) {
    
    const [staff, setStaff] = useState([]);


    const handleUpdateButtonClick = (staffId) => {
        setSelectedStaffIdId(staffId);
        setShowUpdateForm(!showUpdateForm);
    };
    

    useEffect(() => {
        axios.get('http://localhost:9004/api/staff')
            .then(res => setStaff(res.data))
            .catch(err => console.log(err));
    }, []);



    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:9004/api/staff/delete/${id}`);
            setStaff(staff.filter(item => item.Emp_ID !== id));
        } catch (err) {
            console.log(err);
        }
    }



    return (
        <div className='container-fluid mt-4'>
    

    <button className='bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' style={{ borderRadius: '0.5rem' }} onClick={() => setShowCreateForm(!showCreateForm)}>
        {showCreateForm ? 'Close Add Form' : 'Add Staff'}
    </button>

    <div className="table-responsive">
        <div className="py-8">
            <div>
                <h2 className="text-2xl font-semibold leading-tight">Staff</h2>
            </div>
            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">FirstName</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">LastName</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Joining Date</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">EmpType</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Address</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Deptartment</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">SSN</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">DOB</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date of seperation</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Update</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.map((data, i) => (
                                <tr key={i}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm" >{data.Emp_Fname}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Emp_Lname}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Joining_Date}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm" >{data.Emp_type}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Email}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Address}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm" >{data.Dept_ID}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.SSN}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.DOB}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Date_Separation}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleUpdateButtonClick(data.Emp_ID)}>
                                            {showUpdateForm ? 'Close Update Form' : 'Update'}
                                        </button>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <button className='bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => handleDelete(data.Emp_ID)} style={{ borderRadius: '0.5rem', padding: '5px 10px' }}>Delete</button>
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

export default Staff;
