import React, { useState } from 'react';
import Department from "./Department/Department";
import CreateDepartment from "./Department/CreateDepartment";
import UpdateDepartment from "./Department/UpdateDepartment";

export function Departments() {

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedDepartmentId, setSelectedDepartmentIdId] = useState(null); 
    return (
        <>
            <div> 
                <Department
                   
                    setShowCreateForm={setShowCreateForm}
                    setShowUpdateForm={setShowUpdateForm} 
                    setSelectedDepartmentIdId={setSelectedDepartmentIdId} 
                />
                {showCreateForm && <CreateDepartment />}
                
                {showUpdateForm && <UpdateDepartment id={selectedDepartmentId} />} 
            </div>
        </>
    );
}

export default Departments;