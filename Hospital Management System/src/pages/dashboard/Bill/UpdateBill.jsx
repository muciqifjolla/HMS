import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ErrorModal from '../../../components/ErrorModal'; 

function UpdateBill({ id, onClose }) {
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
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/bill/${id}`);
                const data = response.data;
                setFormData(data);
            } catch (error) {
                console.error('Error fetching bill:', error);
                showAlert('Error fetching bill details.');
            }
        };

        fetchData();
    }, [id]);

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleUpdateBill = async () => {
        try {
            await axios.put(`http://localhost:9004/api/bill/update/${id}`, formData);
            onClose(); // Close the modal after updating
            window.location.reload(); // Reload the page
        } catch (error) {
            console.error('Error updating bill:', error);
            showAlert('Error updating bill.');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <div className="bg-white p-8 mx-auto rounded-lg w-96">
                {showErrorModal && (
                    <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
                )}
                <h1 className="text-lg font-bold mb-4">Update Bill</h1>
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
                <div className="flex justify-end">
                    <button type="button" className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleUpdateBill}>
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

export default UpdateBill;
