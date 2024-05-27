import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';
import Cookies from 'js-cookie'; // Import js-cookie
function CreateInsurance({onClose}) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Ins_Code: '',
        End_Date: '',
        Provider: '',
        Plan: '',
        Co_Pay: '',
        Coverage: '',
        Maternity: '',
        Dental: '',
        Optical: '',
    });
    const [insurance, setInsurance] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();
    const token = Cookies.get('token'); 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    useEffect(() => {
        // Fetch existing medicines when component mounts
        fetchInurance();
    }, []);

    const fetchInurance = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/insurance',{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            setInsurance(response.data);
        } catch (error) {
            console.error('Error fetching insurance:', error);
        }
    };

    const handleAddInsurance = async () => {
        try {
            await axios.post("http://localhost:9004/api/insurance/create", formData,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            navigate('/dashboard/insurance');
            window.location.reload(); // Refresh after successful addition
        } catch (error) {
            console.error('Error adding insurance:', error);
            showAlert('Error adding insurance. Please try again.');
        }
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
        // Automatically hide the error modal after 3 seconds
    };

    const handleValidation = async () => {
        const {
            Patient_ID,
            Ins_Code,
            End_Date,
            Provider,
            Plan,
            Co_Pay,
            Coverage,
            Maternity,
            Dental,
            Optical,
        } = formData;
    
        if (Patient_ID === '' || Ins_Code === '' || End_Date === '' || Provider === '' || Plan === '' || Co_Pay === '' || Coverage === '' || Maternity === '' || Dental === '' || Optical === '') {
            showAlert('All fields are required!');
            return;
        }
        if (Ins_Code.length < 6) {
            showAlert("Insurance Code must be at least 6 characters.");
            return;
        }
        if (Patient_ID < 1) {
            showAlert('Patient ID can not be less than 1');
            return;
        }
    
        const existingInsurance = insurance.find(insurance => insurance.Ins_Code === Ins_Code);
        if (existingInsurance) {
            showAlert('Insurance with the same code already exists');
            return;
        }
        try {
            await axios.get(`http://localhost:9004/api/patient/check/${Patient_ID}`);
            // Proceed with form submission after successful validation
            handleAddInsurance();
        } catch (error) {
            console.error('Error checking patient ID:', error);
            showAlert('Patient ID does not exist');
        }
       
    };
    

    return (
        <div className='fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50'>
            <div className='bg-white p-8 mx-auto rounded-lg w-96'>
                {showErrorModal && (
                    <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
                )}
                <h1 className='text-lg font-bold mb-4'>Add Insurance</h1>
                {/* Patient ID */}
                <div className='mb-2'>
                    <label htmlFor='Patient_ID'>Patient ID:</label>
                    <input
                        type='number'
                        name='Patient_ID'
                        placeholder='Enter Patient ID'
                        className='form-control w-full'
                        value={formData.Patient_ID}
                        onChange={handleChange}
                    />
                </div>
                {/* Ins_Code */}
                <div className='mb-2'>
                    <label htmlFor='Ins_Code'>Insurance Code:</label>
                    <input
                        type='number'
                        name='Ins_Code'
                        placeholder='Enter Insurance Code'
                        className='form-control w-full'
                        value={formData.Ins_Code}
                        onChange={handleChange}
                    />
                </div>
                {/* End Date */}
                <div className='mb-2'>
                    <label htmlFor='End_Date'>End Date:</label>
                    <input
                        type='date'
                        name='End_Date'
                        placeholder='Enter End Date'
                        className='form-control w-full'
                        value={formData.End_Date}
                        onChange={handleChange}
                    />
                </div>
                {/* Provider */}
                <div className='mb-2'>
                    <label htmlFor='Provider'>Provider:</label>
                    <select
                        name='Provider'
                        className='form-control w-full'
                        value={formData.Provider}
                        onChange={handleChange}
                    >
                        <option value=''>Select Provider</option>
                        <option value='No'>No</option>
                        <option value='Yes'>Yes</option>
                    </select>
                </div>
                {/* Plan */}
                <div className='mb-2'>
                    <label htmlFor='Plan'>Plan:</label>
                    <select
                        name='Plan'
                        className='form-control w-full'
                        value={formData.Plan}
                        onChange={handleChange}
                    >
                        <option value=''>Select Plan</option>
                        <option value='No'>No</option>
                        <option value='Yes'>Yes</option>
                    </select>
                </div>
                {/* Co-Pay */}
                <div className='mb-2'>
                    <label htmlFor='Co_Pay'>Co-Pay:</label>
                    <select
                        name='Co_Pay'
                        className='form-control w-full'
                        value={formData.Co_Pay}
                        onChange={handleChange}
                    >
                        <option value=''>Select Co-Pay</option>
                        <option value='No'>No</option>
                        <option value='Yes'>Yes</option>
                    </select>
                </div>
                {/* Coverage */}
                <div className='mb-2'>
                    <label htmlFor='Coverage'>Coverage:</label>
                    <select
                        name='Coverage'
                        className='form-control w-full'
                        value={formData.Coverage}
                        onChange={handleChange}
                    >
                        <option value=''>Select Coverage</option>
                        <option value='25%'>25%</option>
                        <option value='50%'>50%</option>
                        <option value='75%'>75%</option>
                        <option value='100%'>100%</option>
                    </select>
                </div>
                {/* Maternity */}
                <div className='mb-2'>
                    <label htmlFor='Maternity'>Maternity:</label>
                    <select
                        name='Maternity'
                        className='form-control w-full'
                        value={formData.Maternity}
                        onChange={handleChange}
                    >
                        <option value=''>Select Maternity</option>
                        <option value='No'>No</option>
                        <option value='Yes'>Yes</option>
                    </select>
                </div>
                {/* Dental */}
                <div className='mb-2'>
                    <label htmlFor='Dental'>Dental:</label>
                    <select
                        name='Dental'
                        className='form-control w-full'
                        value={formData.Dental}
                        onChange={handleChange}
                    >
                        <option value=''>Select Dental</option>
                        <option value='No'>No</option>
                        <option value='Yes'>Yes</option>
                    </select>
                </div>
                {/* Optical */}
                <div className='mb-2'>
                    <label htmlFor='Optical'>Optical:</label>
                    <select
                        name='Optical'
                        className='form-control w-full'
                        value={formData.Optical}
                        onChange={handleChange}
                    >
                        <option value=''>Select Optical</option>
                        <option value='No'>No</option>
                        <option value='Yes'>Yes</option>
                    </select>
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

export default CreateInsurance;
