import React, { useState } from 'react';

import Insurance from "./Insurance/Insurance"
import UpdateInsurance from './Insurance/UpdateInsurance';
import CreateInsurance from './Insurance/CreateInsurance';
export function Insurances() {

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedInsuranceId, setSelectedInsuranceId] = useState(null); 

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        if (showUpdateForm) {
            setShowUpdateForm(false); // Ensure update form is closed
        }
    };

    const handleUpdateFormToggle = () => {
        setShowUpdateForm(!showUpdateForm);
        if (showCreateForm) {
            setShowCreateForm(false); // Ensure create form is closed
        }
    };
    return (
        <>
            <div> 
                <Insurance
                   
                   showCreateForm={showCreateForm}
                   setShowCreateForm={handleCreateFormToggle}
                   showUpdateForm={showUpdateForm}
                   setShowUpdateForm={handleUpdateFormToggle}
                   setSelectedInsuranceId={setSelectedInsuranceId}
                />
                {showCreateForm && <CreateInsurance />}
                
                {showUpdateForm && <UpdateInsurance id={selectedInsuranceId} />} 
            </div>
        </>
    );
}

export default Insurances;
