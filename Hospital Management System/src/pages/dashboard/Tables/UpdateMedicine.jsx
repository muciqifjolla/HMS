import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UpdateMedicine({id}) {


    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [cost, setCost] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/medicine/${id}`);
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
            await axios.put(`http://localhost:9004/api/medicine/update/${id}`, { name, quantity, cost});
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
    
    );

}

export default UpdateMedicine;
