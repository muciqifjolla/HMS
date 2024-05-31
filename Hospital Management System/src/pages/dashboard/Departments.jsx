import axios from 'axios';
import React, { useState } from 'react';
import Department from "./Department/Department";
import CreateDepartment from "./Department/CreateDepartment";
import UpdateDepartment from "./Department/UpdateDepartment";

export function Departments() {

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedDepartmentId, setSelectedDepartmentIdId] = useState(null); 
   
    const handleUpdateButtonClick = (departmentId) => {
        setSelectedDepartmentId(departmentId);
        setShowUpdateForm((prevState) => prevState === departmentId ? null : departmentId);
        setShowCreateForm(false); // Close create form if open
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:9004/api/department/delete/${id}`);
            setShowCreateForm(false);
            setShowUpdateForm(false);
            // Fetch and update department list here if needed
        } catch (error) {
            console.error('Error deleting department:', error);
        }
    };

    return (
        <>
            <div> 
                <Department
                    showCreateForm={showCreateForm}
                    setShowCreateForm={setShowCreateForm}
                    setShowUpdateForm={setShowUpdateForm}
                    setSelectedDepartmentIdId={setSelectedDepartmentIdId} 
                    showUpdateForm={showUpdateForm}
                    handleUpdateButtonClick={handleUpdateButtonClick}
                    handleDelete={handleDelete}
                />
                {showCreateForm && <CreateDepartment onClose={() => setShowCreateForm(false)}/>}
                {showUpdateForm && <UpdateDepartment id={selectedDepartmentId} setShowUpdateForm={setShowUpdateForm} onClose={() => setShowUpdateForm(false)}/>}
            </div>
        </>
    );
}

export default Departments;