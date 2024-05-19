import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';

function CreateStaff({ onClose }) {
    const [formData, setFormData] = useState({
        Emp_Fname: '',
        Emp_Lname: '',
        Joining_Date: '',
        Emp_type: '',
        Email: '',
        Address: '',
        Dept_ID: '',
        SSN: '',
        DOB: '',
        Date_Separation: '',
    });
    const [staff, setStaff] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/staff');
            setStaff(response.data);
        } catch (error) {
            console.error('Error fetching staff:', error);
        }
    };

    const handleAddStaff = async () => {
        try {
            await axios.post("http://localhost:9004/api/staff/create", formData);
            navigate('/dashboard/staffs');
            window.location.reload();// Refresh after successful addition
        } catch (error) {
            console.error('Error adding Staff:', error);
            showAlert('Error adding staff. Please try again.');
        }
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    const handleValidation = async () => {
        const {
            Emp_Fname,
            Emp_Lname,
            Joining_Date,
            Emp_type,
            Email,
            Address,
            Dept_ID,
            SSN,
            DOB,
            Date_Separation,
        } = formData;

        

        if (!Emp_Fname || !Emp_Lname || !Joining_Date || !Emp_type || !Email || !Address || !Dept_ID || !SSN || !DOB || !Date_Separation) {
            showAlert('All fields are required!');
            return;
        }
        const validateEmail = (Email) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(email).toLowerCase());
        };

        if (!validateEmail(Email)) {
            showAlert('Invalid email format.');
            return;
        }
       

        const existingStaff = staff.find(staff => staff.SSN === SSN);
        if (existingStaff) {
            showAlert('Staff member with the same SSN already exists.');
            return;
        }

        try {
            await axios.get(`http://localhost:9004/api/department/check/${Dept_ID}`);
            handleAddStaff();
        } catch (error) {
            console.error('Error checking department existence:', error);
            showAlert('Dept_ID does not exist.');
            
        } 
    };

  

    return (
        <div className='fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50'>
            <div className='bg-white p-8 mx-auto rounded-lg w-96'>
                {showErrorModal && (
                    <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
                )}
                <h1 className='text-lg font-bold mb-4'>Add Staff</h1>
                <div className='mb-2'>
                    <label htmlFor="Emp_Fname">Name: </label>
                    <input type='text' name="Emp_Fname" placeholder='Enter Name' className='form-control w-full' value={formData.Emp_Fname} onChange={handleChange} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="Emp_Lname">Surname: </label>
                    <input type='text' name="Emp_Lname" placeholder='Enter Lastname' className='form-control w-full' value={formData.Emp_Lname} onChange={handleChange} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="Joining_Date">Joining Date: </label>
                    <input type='date' name="Joining_Date" placeholder='Enter Joining Date' className='form-control w-full' value={formData.Joining_Date} onChange={handleChange} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="Emp_type">Employee Type: </label>
                    <input type='text' name="Emp_type" placeholder='Enter Employee Type' className='form-control w-full' value={formData.Emp_type} onChange={handleChange} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="Email">Email: </label>
                    <input type='email' name="Email" placeholder='Enter Email' className='form-control w-full' value={formData.Email} onChange={handleChange} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="Address">Address: </label>
                    <input type='text' name="Address" placeholder='Enter Address' className='form-control w-full' value={formData.Address} onChange={handleChange} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="Dept_ID">
                        Department: 
                        </label>
                    <input type='number' 
                    name="Dept_ID" placeholder='Enter Department'
                     className='form-control w-full'
                      value={formData.Dept_ID} 
                      onChange={handleChange} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="SSN">SSN: </label>
                    <input type='text' name="SSN" placeholder='Enter SSN' className='form-control w-full' value={formData.SSN} onChange={handleChange} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="DOB">DOB: </label>
                    <input type='date' name="DOB" placeholder='Enter Date of Birth' className='form-control w-full' value={formData.DOB} onChange={handleChange} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="Date_Separation">Date of Separation: </label>
                    <input type='date' name="Date_Separation" placeholder='Enter Date of Separation' className='form-control w-full' value={formData.Date_Separation} onChange={handleChange} />
                </div>
                <div className='flex justify-end'>
                    <button
                        className='bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                        onClick={handleValidation}>
                        Submit
                    </button>
                    <button
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 ml-2 rounded"
                        onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateStaff;
