import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal';

function CreateBill({onClose}) {
    const [formData, setFormData] = useState({
        Patient_ID: '',
        Room_ID: '',
        Medicine_ID: '',
        DATE: '',
        Room_cost: '',
        Other_charges: '',
        M_Cost: '',
        Total: '',
    });
    const [bill, setBill] = useState([]);
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
        // Fetch existing medicines when component mounts
        fetchBill();
    }, []);

    const fetchBill = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/bill');
            setBill(response.data);
        } catch (error) {
            console.error('Error fetching bill:', error);
        }
    };

    const handleAddBill = async () => {
        try {
            await axios.post("http://localhost:9004/api/bill/create", formData);
            navigate('/dashboard/bill');
            window.location.reload(); // Refresh after successful addition
        } catch (error) {
            console.error('Error adding bill:', error);
            showAlert('Error adding bill. Please try again.');
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
            Room_ID,
            Medicine_ID,
            DATE,
            Room_cost,
            Other_charges,
            M_Cost,
            Total,
        } = formData;
    
        if (Patient_ID === '' || Room_ID === '' || Medicine_ID === '' || DATE === '' || Room_cost === '' || Other_charges === '' || M_Cost === '' || Total === '') {
            showAlert('All fields are required!');
            return;
        }
      
      try {
            await axios.get(`http://localhost:9004/api/patient/check/${Patient_ID}`);
            await axios.get(`http://localhost:9004/api/rooms/check/${Room_ID}`);
            await axios.get(`http://localhost:9004/api/medicines/check/${Medicine_ID}`);
            // Proceed with form submission after successful validation
            handleAddBill();
        } catch (error) {
            console.error('Error checking IDs:', error);
            showAlert('One or more IDs do not exist');
        }
       
    };
    

    return (
        <div className='fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50'>
            <div className='bg-white p-8 mx-auto rounded-lg w-96'>
                {showErrorModal && (
                    <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
                )}
                <h1 className='text-lg font-bold mb-4'>Add Bill</h1>
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
               {/* Room_ID */}
<div className='mb-2'>
    <label htmlFor='Room_ID'>Room ID:</label>
    <input
        type='text'
        name='Room_ID'
        placeholder='Enter Room ID'
        className='form-control w-full'
        value={formData.Room_ID}
        onChange={handleChange}
    />
</div>

{/* Medicine_ID */}
<div className='mb-2'>
    <label htmlFor='Medicine_ID'>Medicine ID:</label>
    <input
        type='text'
        name='Medicine_ID'
        placeholder='Enter Medicine ID'
        className='form-control w-full'
        value={formData.Medicine_ID}
        onChange={handleChange}
    />
</div>

{/* M_Cost */}
<div className='mb-2'>
    <label htmlFor='M_Cost'>Medicine Cost:</label>
    <input
        type='number'
        name='M_Cost'
        placeholder='Enter Medicine Cost'
        className='form-control w-full'
        value={formData.M_Cost}
        onChange={handleChange}
    />
</div>

{/* Date */}
<div className='mb-2'>
    <label htmlFor='Date'>Date:</label>
    <input
        type='date'
        name='Date'
        placeholder='Enter Date'
        className='form-control w-full'
        value={formData.Date}
        onChange={handleChange}
    />
</div>

{/* Room_cost */}
<div className='mb-2'>
    <label htmlFor='Room_cost'>Room Cost:</label>
    <input
        type='number'
        name='Room_cost'
        placeholder='Enter Room Cost'
        className='form-control w-full'
        value={formData.Room_cost}
        onChange={handleChange}
    />
</div>

{/* Other_charges */}
<div className='mb-2'>
    <label htmlFor='Other_charges'>Other Charges:</label>
    <input
        type='number'
        name='Other_charges'
        placeholder='Enter Other Charges'
        className='form-control w-full'
        value={formData.Other_charges}
        onChange={handleChange}
    />
</div>

{/* Total */}
<div className='mb-2'>
    <label htmlFor='Total'>Total:</label>
    <input
        type='number'
        name='Total'
        placeholder='Enter Total'
        className='form-control w-full'
        value={formData.Total}
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

export default CreateBill;
