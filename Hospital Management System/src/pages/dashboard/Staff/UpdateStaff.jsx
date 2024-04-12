import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UpdateStaff({id}) {


    const navigate = useNavigate();
    const [emp_Fname, setEmp_Fname] = useState('');
    const [emp_Lname, setEmp_Lname] = useState('');
    const [joiningDate, setJoining_Date] = useState('');
    const [emp_type, setEmp_type] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [dept, setDept_ID] = useState('');
    const [socialSecurityNumber, setSSN] = useState('');
    const [dateofBirth, setDOB] = useState('');
    const [dateSeparation, setDate_Separation] = useState('');

    console.log(emp_Fname);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/staff/${id}`);
                const formattedJoining_Date = new Date(response.data.Joining_Date).toISOString().split('T')[0];
                const formattedDOB = new Date(response.data.DOB).toISOString().split('T')[0];
                setEmp_Fname(response.data.Emp_Fname);
                setEmp_Lname(response.data.Emp_Lname);
                setJoining_Date(formattedJoining_Date);
                setEmp_type(response.data.Emp_type);
                setEmail(response.data.Email);
                setAddress(response.data.Address);
                setDept_ID(response.data.Dept_ID);
                setSSN(response.data.SSN);
                setDOB(formattedDOB);
                setDate_Separation(response.data.Date_Separation);
            } catch (error) {
                console.error('Error fetching staff:', error);
            }
        };

        fetchData();
    }, []);


    const handleUpdateStaff = async () => {
        
        try {
            // const timeWithSeconds = time + ':00';

            await axios.put(`http://localhost:9004/api/staff/update/${id}`, {  
                Emp_Fname: emp_Fname,
                Emp_Lname: emp_Lname,
                Joining_Date: joiningDate,
                Emp_type: emp_type,
                Email: email,
                Address: address,
                Dept_ID: dept,
                SSN: socialSecurityNumber,
                DOB: dateofBirth,
                Date_Separation: dateSeparation,
        });
        setEmp_Fname(emp_Fname);
        setEmp_Lname(emp_Lname);
        setJoining_Date(joiningDate);
        setEmp_type(emp_type);
        setEmail(email);
        setAddress(address);
        setDept_ID(dept);
        setSSN(socialSecurityNumber);
        setDOB(dateofBirth);
        setDate_Separation(dateSeparation);

            navigate('/dashboard/staffs');
            window.location.reload();
        } catch (error) {
            console.error('Error updating appointment:', error);
        }
    };

    
    return (
        <div className='bg-white rounded p-3'>
        <div className='mb-2'>
            <label htmlFor="emp_Fname">Name</label>
            <input type='text' id="emp_Fname" placeholder='Enter Name' className='form-control'
                value={emp_Fname} onChange={e => setEmp_Fname(e.target.value)} />
        </div>

        <div className='mb-2'>
            <label htmlFor="emp_LName">Lastname </label>
            <input type='text' id="emp_LName" placeholder='Enter Lastname' className='form-control'
                value={emp_Lname} onChange={e => setEmp_Lname(e.target.value)} />
        </div>

        <div className='mb-2'>
            <label htmlFor="joiningDate">Joining Date</label>
            <input type='date' id="joiningDate" placeholder='Enter joiningDate' className='form-control'
                value={joiningDate} onChange={e => setJoining_Date(e.target.value)} />
        </div>
        <div className='mb-2'>
            <label htmlFor="emp_type">Employee Type</label>
            <input type='text' id="emp_type" placeholder='Enter employee type' className='form-control'
                value={emp_type} onChange={e => setEmp_type(e.target.value)} />
        </div>
        <div className='mb-2'>
            <label htmlFor="email">Email</label>
            <input type='email' id="email" placeholder='Enter email' className='form-control'
                value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className='mb-2'>
            <label htmlFor="address">Address</label>
            <input type='text' id="address" placeholder='Enter address' className='form-control'
                value={address} onChange={e => setAddress(e.target.value)} />
        </div>
        <div className='mb-2'>
            <label htmlFor="dept">Department</label>
            <input type='number' id="emp_type" placeholder='Enter dept' className='form-control'
                value={dept} onChange={e => setDept_ID(e.target.value)} />
        </div>
        <div className='mb-2'>
            <label htmlFor="socialSecurityNumber">SSN</label>
            <input type='text' id="socialSecurityNumber" placeholder='Enter SSN' className='form-control'
                value={socialSecurityNumber} onChange={e => setSSN(e.target.value)} />
        </div>
        <div className='mb-2'>
            <label htmlFor="dateofBirth">DOB</label>
            <input type='date' id="dateofBirth" placeholder='Enter dateofBirth' className='form-control'
                value={dateofBirth} onChange={e => setDOB(e.target.value)} />
        </div>
        <div className='mb-2'>
            <label htmlFor="dateSeperation">Date_Seperation</label>
            <input type='date' id="dateSeperation" placeholder='Enter dateSeperation' className='form-control'
                value={dateSeparation} onChange={e => setDate_Separation(e.target.value)} />
        </div>
       
        <button type="button" className='btn btn-success' onClick={handleUpdateStaff }>Submit</button>
    </div>
    
    );

}

export default UpdateStaff;
