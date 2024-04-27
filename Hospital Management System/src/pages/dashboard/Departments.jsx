import React, { useState } from 'react';
import Department from "./Department/Department";
import CreateDepartment from "./Department/CreateDepartment";
import UpdateDepartment from "./Department/UpdateDepartment";

export function Departments() {

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedDepartmentId, setSelectedDepartmentIdId] = useState(null); 
   
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
                <Department
                    showCreateForm={showCreateForm}
                    setShowCreateForm={handleCreateFormToggle}
                    showUpdateForm={showUpdateForm}
                    setShowUpdateForm={handleUpdateFormToggle}
                    setSelectedDepartmentIdId={setSelectedDepartmentIdId} 
                />
                {showCreateForm && <CreateDepartment />}
                
                {showUpdateForm && <UpdateDepartment id={selectedDepartmentId} />} 
            </div>
        </>
    );
}

export default Departments;