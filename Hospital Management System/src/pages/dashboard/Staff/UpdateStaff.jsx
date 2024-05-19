import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ErrorModal from '../../../components/ErrorModal';

function UpdateStaff({ id,onClose }) {
    const [emp_Fname, setEmp_Fname] = useState('');
    const [emp_Lname, setEmp_Lname] = useState('');
    const [joining_Date, setJoining_Date] = useState('');
    const [emp_type, setEmp_type] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [dept_ID, setDept_ID] = useState('');
    const [ssn, setSSN] = useState('');
    const [dob, setDOB] = useState('');
    const [date_Separation, setDate_Separation] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const [staff, setStaff] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/staff/${id}`);
                const data = response.data;
                const formattedJoining_Date = new Date(data.Joining_Date).toISOString().split('T')[0];
                const formattedDOB = new Date(data.DOB).toISOString().split('T')[0];
                setOriginalData(data);
                setEmp_Fname(data.Emp_Fname);
                setEmp_Lname(data.Emp_Lname);
                setJoining_Date(formattedJoining_Date);
                setEmp_type(data.Emp_type);
                setEmail(data.Email);
                setAddress(data.Address);
                setDept_ID(data.Dept_ID);
                setSSN(data.SSN);
                setDOB(formattedDOB);
                setDate_Separation(data.Date_Separation);
            } catch (error) {
                console.error('Error fetching staff:', error);
                showAlert('Error fetching staff details.');
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchAllStaff = async () => {
            try {
                const response = await axios.get('http://localhost:9004/api/staff');
                setStaff(response.data);
            } catch (error) {
                console.error('Error fetching Staff:', error);
            }
        };

        fetchAllStaff();
    }, []);

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    const handleUpdateStaff = async () => {
        if (!emp_Fname.trim() || !emp_Lname.trim() || !joining_Date || !emp_type.trim() ||
            !email.trim() || !address.trim() || !dept_ID || !ssn.trim() || !dob || !date_Separation) {
            showAlert("Please fill in all fields.");
            return;
        }

        if (
            emp_Fname === originalData.Emp_Fname &&
            emp_Lname === originalData.Emp_Lname &&
            joining_Date === originalData.Joining_Date &&
            emp_type === originalData.Emp_type &&
            email === originalData.Email &&
            address === originalData.Address &&
            dept_ID === originalData.Dept_ID &&
            ssn === originalData.SSN &&
            dob === originalData.DOB &&
            date_Separation === originalData.Date_Separation
        ) {
            showAlert("Data must be changed before updating.");
            return;
        }
        const existingStaff = staff.find(staff =>   staff.SSN === ssn && staff.Emp_ID!==id);
        if (existingStaff) {
            showAlert('Staff with the same details already exists');
            return;
        }
    
        try {
            await axios.put(`http://localhost:9004/api/staff/update/${id}`, {
                Emp_Fname: emp_Fname,
                Emp_Lname: emp_Lname,
                Joining_Date: joining_Date,
                Emp_type: emp_type,
                Email: email,
                Address: address,
                Dept_ID: dept_ID,
                SSN: ssn,
                DOB: dob,
                Date_Separation: date_Separation,
            });
    
            window.location.reload(); // Consider updating only necessary parts of UI instead
        } catch (error) {
            console.error('Error updating staff:', error);
            showAlert('Error updating staff.');
        }
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50'>
            <div className='bg-white p-8 mx-auto rounded-lg w-96'>
                {showErrorModal && (
                    <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
                )}
                <h1 className='text-lg font-bold mb-4'>Update Staff</h1>
                <div className='mb-4'>
                    <label htmlFor='emp_Fname'>Name:</label>
                    <input
                        type='text'
                        id='emp_Fname'
                        placeholder='Enter First Name'
                        className='form-control'
                        value={emp_Fname}
                        onChange={(e) => setEmp_Fname(e.target.value)}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor='emp_Lname'>Surname:</label>
                    <input
                        type='text'
                        id='emp_Lname'
                        placeholder='Enter Last Name'
                        className='form-control'
                        value={emp_Lname}
                        onChange={(e) => setEmp_Lname(e.target.value)}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor='joining_Date'>Joining Date:</label>
                    <input
                        type='date'
                        id='joining_Date'
                        className='form-control'
                        value={joining_Date}
                        onChange={(e) => setJoining_Date(e.target.value)}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor='emp_type'>Employee Type:</label>
                    <input
                        type='text'
                        id='emp_type'
                        placeholder='Enter Employee Type'
                        className='form-control'
                        value={emp_type}
                        onChange={(e) => setEmp_type(e.target.value)}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor='email'>Email:</label>
                    <input
                        type='email'
                        id='email'
                        placeholder='Enter Email'
                        className='form-control'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor='address'>Address:</label>
                    <input
                        type='text'
                        id='address'
                        placeholder='Enter Address'
                        className='form-control'
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor='dept_ID'>Department ID:</label>
                    <input
                        type='number'
                        id='dept_ID'
                        placeholder='Enter Department ID'
                        className='form-control'
                        value={dept_ID}
                        onChange={(e) => setDept_ID(e.target.value)}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor='ssn'>SSN:</label>
                    <input
                        type='text'
                        id='ssn'
                        placeholder='Enter SSN'
                        className='form-control'
                        value={ssn}
                        onChange={(e) => setSSN(e.target.value)}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor='dob'>Date of Birth:</label>
                    <input
                        type='date'
                        id='dob'
                        className='form-control'
                        value={dob}
                        onChange={(e) => setDOB(e.target.value)}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor='date_Separation'>Date of Separation:</label>
                    <input
                        type='date'
                        id='date_Separation'
                        className='form-control'
                        value={date_Separation}
                        onChange={(e) => setDate_Separation(e.target.value)}
                    />
                </div>
                <div className='flex justify-end'>
                    <button
                        type='button'
                        className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
                        onClick={handleUpdateStaff}
                    >
                        Submit
                    </button>
                    <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 ml-2 rounded"
                    onClick={onClose} // Call the onClose function passed from props
                >
                    Cancel
                </button>
                </div>
            </div>
        </div>
    );
}

export default UpdateStaff;

