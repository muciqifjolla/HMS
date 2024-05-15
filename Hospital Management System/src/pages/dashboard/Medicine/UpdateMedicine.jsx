import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ErrorModal from '../../../components/ErrorModal'; // Ensure this component exists for error handling

function UpdateMedicine({ id, onClose }) {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [cost, setCost] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/medicine/${id}`);
                const data = response.data;
                setOriginalData(data);
                setName(data.M_name);
                setQuantity(data.M_Quantity);
                setCost(data.M_Cost);
            } catch (error) {
                console.error('Error fetching medicine:', error);
                showAlert('Error fetching medicine details.');
            }
        };

        fetchData();
    }, [id]);

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
        setTimeout(() => {
            setAlertMessage('');
            setShowErrorModal(false);
        }, 3000);
    };

    const handleUpdateMedicine = async () => {
        // Basic validation
        // Basic validation
        if (
            name === originalData.M_name &&
            quantity === originalData.M_Quantity &&
            cost === originalData.M_Cost
        ) {
            showAlert("Data must be changed before updating.");
            return;
        }
        if (!name.trim()) {
            showAlert("Medicine name cannot be empty.");
            return;
        }

        if (!quantity || quantity < 1) {
            showAlert("Quantity must be at least 1.");
            return;
        }

        if (!cost || cost < 1) {
            showAlert("Cost must be at least 1.");
            return;
        }

        try {
            await axios.put(`http://localhost:9004/api/medicine/update/${id}`, {
                M_name: name,
                M_Quantity: quantity,
                M_Cost: cost,
            });

             // Close the modal after updating
            window.location.reload(); // Refresh the page to show the updated data
        } catch (error) {
            console.error('Error updating medicine:', error);
            showAlert('Error updating medicine. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <div className="bg-white p-8 mx-auto rounded-lg w-96">
                {showErrorModal && (
                    <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
                )}
                <h1 className="text-lg font-bold mb-4">Update Medicine</h1>
                <div className='mb-4'>
                    <label htmlFor='medicineName'>Medicine Name:</label>
                    <input
                        type='text'
                        id='medicineName'
                        placeholder='Enter Medicine Name'
                        className='form-control w-full'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor='medicineQuantity'>Quantity:</label>
                    <input
                        type='number'
                        id='medicineQuantity'
                        placeholder='Enter Quantity'
                        className='form-control w-full'
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </div>
                <div className='mb-4'>
                    <label htmlFor='medicineCost'>Cost:</label>
                    <input
                        type='number'
                        id='medicineCost'
                        placeholder='Enter Cost'
                        className='form-control w-full'
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleUpdateMedicine}
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

export default UpdateMedicine;
