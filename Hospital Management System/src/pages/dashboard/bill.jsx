import React, { useState } from 'react';
import axios from 'axios';
import Bill from "./Bill/Bill";
import UpdateBill from './Bill/UpdateBill';
import CreateBill from './Bill/CreateBill';

export function Bills() {
    
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedBillId, setSelectedBillId] = useState(null); 

    const handleUpdateButtonClick = (billId) => {
        setSelectectedBillId(billId);
        setShowUpdateForm((prevState) => prevState === billId ? null : billId);
        setShowCreateForm(false); // Close create form if open
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:9004/api/bill/delete/${id}`);
            setShowCreateForm(false);
            setShowUpdateForm(false);
            // Fetch and update insurance list here if needed
        } catch (error) {
            console.error('Error deleting bill:', error);
        }
    };

    return (
        <>
            <div> 
                <Bill
                    showCreateForm={showCreateForm}
                    setShowCreateForm={setShowCreateForm}
                    setShowUpdateForm={setShowUpdateForm}
                    setSelectedBillId={setSelectedBillId}
                    showUpdateForm={showUpdateForm}
                    handleUpdateButtonClick={handleUpdateButtonClick}
                    handleDelete={handleDelete}
                />
                
                {showCreateForm && <CreateBill onClose={() => setShowCreateForm(false)}/>}
                {showUpdateForm && <UpdateBill id={selectedBillId} setShowUpdateForm={setShowUpdateForm} onClose={() => setShowUpdateForm(false)}/>} 
            </div>
        </>
    );
}

export default Bills;