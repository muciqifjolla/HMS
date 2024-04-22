import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UpdateMedicine({id}) {


    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [originalData, setOriginalData] = useState({});
    const [cost, setCost] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            try {
               
                const response = await axios.get(`http://localhost:9004/api/medicine/${id}`);
                const data = response.data;
                setOriginalData(data);
                setName(response.data.M_name);
                setQuantity(response.data.M_Quantity);
                setCost(response.data.M_Cost);
            } catch (error) {
                console.error('Error fetching medicine:', error);
            }
        };

        fetchData();
    }, []);


    const handleUpdateMedicine = async () => {
        
        try {

            if (!name.trim()) {
                setAlertMessage("Medicine name cannot be empty.");
                return;
            }
            if (
                name === originalData.M_name &&
                quantity === originalData.M_Quantity &&
                cost === originalData.M_Cost
            ) {
                setAlertMessage("Data must be changed before updating.");
                return;
            }

            if (name.length < 5) {
                setAlertMessage("Medicine name must be at least 5 characters long.");
                return;
            }

            if (!quantity) {
                setAlertMessage("Quantity is required.");
                return;
            }

            if (quantity <1) {
                setAlertMessage("Quantity must be at least 1.");
                return;
            }

            if (!cost) {
                setAlertMessage("Cost is required.");
                return;
            }

            if (cost <1) {
                setAlertMessage("Cost must be at least 1.");
                return;
            }

            setAlertMessage(''); 

            await axios.put(`http://localhost:9004/api/medicine/update/${id}`, { 
                
            M_name: name,
            M_Quantity: quantity,
            M_Cost: cost,
            
            });
            setName(name);
            setQuantity(quantity);
            setCost(cost);
            navigate('/dashboard/medicines');
            window.location.reload();
        } catch (error) {
            console.error('Error updating medicine:', error);
        }
    };

    
    return (
        <div className='container mt-4'>
            {alertMessage && (
                <div className='alert alert-warning'>
                    {alertMessage}
                </div>
            )}
        <div className='bg-white rounded p-3'>
            <div className='mb-2'>
                <label htmlFor="medicineName">Medicine Name: </label>
                <input type='text' id="medicineName" placeholder='Enter Name' className='form-control'
                    value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className='mb-2'>
                <label htmlFor="medicineQuantity">Medicine Quantity: </label>
                <input type='number' id="medicineQuantity" placeholder='Enter Quantity' className='form-control'
                    value={quantity} onChange={e => setQuantity(e.target.value)} />
            </div>

            <div className='mb-2'>
                <label htmlFor="medicineCost">Medicine Cost(on €): </label>
                <input type='number' id="medicineCost" placeholder='Enter Cost' className='form-control'
                    value={cost} onChange={e => setCost(e.target.value)} />
            </div>
            <button type="button" className='btn btn-success' onClick={handleUpdateMedicine}>Submit</button>
        </div>
        </div>
    );

}

export default UpdateMedicine;
