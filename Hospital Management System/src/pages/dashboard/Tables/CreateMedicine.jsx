import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateMedicine() {

    
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [cost, setCost] = useState('');
    const navigate = useNavigate();


    const handleAddMedicine = async () => {
        try {
            await axios.post("http://localhost:9004/api/medicine/create", { name, quantity, cost });
            setName('');
            setQuantity('');
            setCost('');
            navigate('/dashboard/medicines');
            window.location.reload();
        } catch (error) {
            console.error('Error adding medicine:', error);
        }
    };


    return (
        <div className='container mt-4'>
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
                    <label htmlFor="medicineCost">Medicine Cost: </label>
                    <input type='number' id="medicineCost" placeholder='Enter Cost' className='form-control'
                        value={cost} onChange={e => setCost(e.target.value)} />
                </div>
                <button type="button" className='btn btn-success' onClick={handleAddMedicine}>Submit</button>
            </div>
        </div>
    );
}

export default CreateMedicine;
