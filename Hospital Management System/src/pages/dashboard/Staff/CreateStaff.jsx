import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateStaff() {

    
    const [emp_Fname, setEmp_Fname] = useState('');
    const [emp_LName, setEmp_LName] = useState('');
    const [joiningDate, setJoining_Date] = useState('');
    const [emp_type, setEmp_type] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [dept, setDept_ID] = useState('');
    const [socialSecurityNumber, setSSN] = useState('');
    const [dateofBirth, setDOB] = useState('');
    const [dateSeperation, setDate_Seperation] = useState('');
    const navigate = useNavigate();


    const handleAddStaff = async () => {
        try {

    
            await axios.post("http://localhost:9004/api/staff/create", {
                Emp_Fname: emp_Fname,
                Emp_Lname: emp_LName,
                Joining_Date: joiningDate,
                Emp_type: emp_type,
                Email: email,
                Address: address,
                Dept_ID: dept,
                SSN: socialSecurityNumber,
                DOB: dateofBirth,
                Date_Separation: dateSeperation,
            });
            setEmp_Fname('');
            setEmp_LName('');
            setJoining_Date('');
            setEmp_type('');
            setEmail('');
            setAddress('');
            setDept_ID('');
            setSSN('');
            setDOB('');
            setDate_Seperation('');
            navigate('/dashboard/staffs');
            window.location.reload();
        } catch (error) {
            console.error('Error adding Staff:', error);
        }
    };


    return (
        <div className='container mt-4'>
            <div className='bg-white rounded p-3'>
                <div className='mb-2'>
                    <label htmlFor="emp_Fname">Name: </label>
                    <input type='text' id="emp_Fname" placeholder='Enter Name' className='form-control'
                        value={emp_Fname} onChange={e => setEmp_Fname(e.target.value)} />
                </div>

                <div className='mb-2'>
                    <label htmlFor="emp_LName">Lastname   </label>
                    <input type='text' id="emp_LName" placeholder='Enter Lastname' className='form-control'
                        value={emp_LName} onChange={e => setEmp_LName(e.target.value)} />
                </div>

                <div className='mb-2'>
                    <label htmlFor="joiningDate">Joining Date  </label>
                    <input type='date' id="joiningDate" placeholder='Enter joiningDate' className='form-control'
                        value={joiningDate} onChange={e => setJoining_Date(e.target.value)} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="emp_type">Employee Type  </label>
                    <input type='text' id="emp_type" placeholder='Enter employee type' className='form-control'
                        value={emp_type} onChange={e => setEmp_type(e.target.value)} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="email">Email  </label>
                    <input type='email' id="email" placeholder='Enter email' className='form-control'
                        value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="address">Address  </label>
                    <input type='text' id="address" placeholder='Enter address' className='form-control'
                        value={address} onChange={e => setAddress(e.target.value)} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="dept">Department  </label>
                    <input type='number' id="dept" placeholder='Enter dept' className='form-control'
                        value={dept} onChange={e => setDept_ID(e.target.value)} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="socialSecurityNumber">SSN  </label>
                    <input type='text' id="socialSecurityNumber" placeholder='Enter SSN' className='form-control'
                        value={socialSecurityNumber} onChange={e => setSSN(e.target.value)} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="dateofBirth">DOB  </label>
                    <input type='date' id="dateofBirth" placeholder='Enter dateofBirth' className='form-control'
                        value={dateofBirth} onChange={e => setDOB(e.target.value)} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="dateSeperation">Date_Seperation  </label>
                    <input type='date' id="dateSeperation" placeholder='Enter dateSeperation' className='form-control'
                        value={dateSeperation} onChange={e => setDate_Seperation(e.target.value)} />
                </div>
               
                <button type="button" className='btn btn-success' onClick={handleAddStaff }>Submit</button>
            </div>
        </div>
    );
}

export default CreateStaff;
