import React, { useState } from 'react';
import axios from 'axios';

import Insurance from "./Insurance/Insurance";
import UpdateInsurance from './Insurance/UpdateInsurance';
import CreateInsurance from './Insurance/CreateInsurance';

export function Insurances() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedInsuranceId, setSelectedInsuranceId] = useState(null); 

    const handleUpdateButtonClick = (insuranceId) => {
        setSelectedInsuranceId(insuranceId);
        setShowUpdateForm((prevState) => prevState === insuranceId ? null : insuranceId);
        setShowCreateForm(false); // Close create form if open
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:9004/api/insurance/delete/${id}`);
            setShowCreateForm(false);
            setShowUpdateForm(false);
            // Fetch and update insurance list here if needed
        } catch (error) {
            console.error('Error deleting insurance:', error);
        }
    };

    return (
        <>
            <div> 
                <Insurance
                    showCreateForm={showCreateForm}
                    setShowCreateForm={setShowCreateForm}
                    setShowUpdateForm={setShowUpdateForm}
                    setSelectedInsuranceId={setSelectedInsuranceId}
                    showUpdateForm={showUpdateForm}
                    handleUpdateButtonClick={handleUpdateButtonClick}
                    handleDelete={handleDelete}
                />
                
                {showCreateForm && <CreateInsurance onClose={() => setShowCreateForm(false)}/>}
                {showUpdateForm && <UpdateInsurance id={selectedInsuranceId} setShowUpdateForm={setShowUpdateForm} onClose={() => setShowUpdateForm(false)}/>} 
            </div>
        </>
    );
}

export default Insurances;