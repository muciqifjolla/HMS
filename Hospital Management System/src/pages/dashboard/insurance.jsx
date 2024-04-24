import React, { useState } from 'react';

import Insurance from "./Insurance/Insurance"
import UpdateInsurance from './Insurance/UpdateInsurance';
import CreateDepartment from './Insurance/CreateInsurance';
export function Insurances() {

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedInsuranceId, setSelectedInsuranceId] = useState(null); 
    return (
        <>
            <div> 
                <Insurance
                   
                    setShowCreateForm={setShowCreateForm}
                    setShowUpdateForm={setShowUpdateForm} 
                    setSelectedInsuranceId={setSelectedInsuranceId} 
                />
                {showCreateForm && <CreateDepartment />}
                
                {showUpdateForm && <UpdateInsurance id={selectedInsuranceId} />} 
            </div>
        </>
    );
}

export default Insurances;
