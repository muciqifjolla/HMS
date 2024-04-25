import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../../../components/ErrorModal'; // Ensure this component exists for error handling

function UpdateMedicine({ id }) {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [cost, setCost] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});
    const navigate = useNavigate();

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

        // Ensure there are changes to update
        if (
            name === originalData.M_name &&
            quantity === originalData.M_Quantity &&
            cost === originalData.M_Cost
        ) {
            showAlert("Data must be changed before updating.");
            return;
        }

        try {
            await axios.put(`http://localhost:9004/api/medicine/update/${id}`, {
                M_name: name,
                M_Quantity: quantity,
                M_Cost: cost,
            });

            navigate('/dashboard/medicines'); // Navigate to the medicines dashboard after updating
            window.location.reload(); // Refresh the page to show the updated data
        } catch (error) {
            console.error('Error updating medicine:', error);
            showAlert('Error updating medicine. Please try again.');
        }
    };

    return (
        <div className="container mt-4">
            {showErrorModal && (
                <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
            )}
            <div className="bg-white rounded p-3">
                <div className="mb-2">
                    <label htmlFor="medicineName">Medicine Name:</label>
                    <input
                        type="text"
                        id="medicineName"
                        placeholder="Enter Medicine Name"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="mb-2">
                    <label htmlFor="medicineQuantity">Quantity:</label>
                    <input
                        type="number"
                        id="medicineQuantity"
                        placeholder="Enter Quantity"
                        className="form-control"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </div>

                <div className="mb-2">
                    <label htmlFor="medicineCost">Cost (in €):</label>
                    <input
                        type="number"
                        id="medicineCost"
                        placeholder="Enter Cost"
                        className="form-control"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                    />
                </div>

                <button type="button" className="btn btn-success" onClick={handleUpdateMedicine}>
                    Submit
                </button>
            </div>
        </div>
    );
}

export default UpdateMedicine;
