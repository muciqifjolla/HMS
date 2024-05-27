import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie'; // Import js-cookie
function CreateDoctor({ onClose }) {
    const [formData, setFormData] = useState({
        Qualifications: '',
        Emp_ID: '',
        Specialization: '',
        user_id: '',
    });
    const [doctor, setDoctor] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get('token'); 

 
    useEffect(() => {
        // Fetch existing medicines when component mounts
        fetchDoctor();
    }, []);

    const fetchDoctor = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/doctors',{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
                });
            setDoctor(response.data);
        } catch (error) {
            console.error('Error fetching doctor:', error);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };


    const handleAddDoctor = async () => {
        try {
            await axios.post("http://localhost:9004/api/doctors/create", formData,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
                });
            navigate('/dashboard/doctors');
            window.location.reload(); // Refresh after successful addition
        } catch (error) {
            console.error('Error adding doctor:', error);
            
        }
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
        
        
    };

    const handleValidation = async () => {
        const { Qualifications, Emp_ID, Specialization, user_id } = formData;

        if (Qualifications === '' || Emp_ID === '' || Specialization === '' || user_id === '') {
            showAlert('All fields are required!');
            return;
        }

        if (Emp_ID < 1) {
            showAlert('Employee ID can not be less than 1');
            return;
        }
    
        const existingDoctor = doctor.find(doctor => doctor.Emp_ID === Emp_ID);
        if (existingDoctor) {
            showAlert('Doctor with the same Emp_ID already exists');
            return;
        }
        // try {
        //     await axios.get(`http://localhost:9004/api/staff/check/${Emp_ID}`);
            
        //     handleAddDoctor();
        // } catch (error) {
        //     console.error('Error checking Emp ID:', error);
        //     showAlert('Emp ID does not exist');
        // }
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50'>
            <div className='bg-white p-8 mx-auto rounded-lg w-96'>
                {showErrorModal && (
                    <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
                )}
                <h1 className='text-lg font-bold mb-4'>Add Doctor</h1>
                {/* Qualifications */}
                <div className='mb-2'>
                    <label htmlFor='Qualifications'>Qualifications:</label>
                    <input
                        type='text'
                        name='Qualifications'
                        placeholder='Enter Qualifications'
                        className='form-control w-full'
                        value={formData.Qualifications}
                        onChange={handleChange}
                    />
                </div>
                {/* Emp_ID */}
                <div className='mb-2'>
                    <label htmlFor='Emp_ID'>Employee ID:</label>
                    <input
                        type='number'
                        name='Emp_ID'
                        placeholder='Enter Employee ID'
                        className='form-control w-full'
                        value={formData.Emp_ID}
                        onChange={handleChange}
                    />
                </div>
                {/* Specialization */}
                <div className='mb-2'>
                    <label htmlFor='Specialization'>Specialization:</label>
                    <input
                        type='text'
                        name='Specialization'
                        placeholder='Enter Specialization'
                        className='form-control w-full'
                        value={formData.Specialization}
                        onChange={handleChange}
                    />
                </div>
                {/* user_id */}
                <div className='mb-2'>
                    <label htmlFor='user_id'>User ID:</label>
                    <input
                        type='number'
                        name='user_id'
                        placeholder='Enter User ID'
                        className='form-control w-full'
                        value={formData.user_id}
                        onChange={handleChange}
                    />
                </div>
                <div className='flex justify-end'>
                    <button
                        className='bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                        onClick={handleValidation}
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

export default CreateDoctor;
