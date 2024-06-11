import React, { useState } from 'react';
import axios from 'axios';

import Doctor from "./Doctor/Doctor";
import UpdateDoctor from './Doctor/UpdateDoctor';
import CreateDoctor from './Doctor/CreateDoctor';

export function Doctors() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedDoctorId, setSelectedDoctorId] = useState(null); 

    const handleUpdateButtonClick = (doctorId) => {
        setSelectedDoctorId(doctorId);
        setShowUpdateForm((prevState) => prevState === doctorId ? null : doctorId);
        setShowCreateForm(false); 
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:9004/api/doctors/delete/${id}`);
            setShowCreateForm(false);
            setShowUpdateForm(false);
            
        } catch (error) {
            console.error('Error deleting doctor:', error);
        }
    };

    return (
        <>
            <div> 
                <Doctor
                    showCreateForm={showCreateForm}
                    setShowCreateForm={setShowCreateForm}
                    setShowUpdateForm={setShowUpdateForm}
                    setSelectedDoctorId={setSelectedDoctorId}
                    showUpdateForm={showUpdateForm}
                    handleUpdateButtonClick={handleUpdateButtonClick}
                    handleDelete={handleDelete}
                />
                
                {showCreateForm && <CreateDoctor onClose={() => setShowCreateForm(false)}/>}
                {showUpdateForm && <UpdateDoctor id={selectedDoctorId} setShowUpdateForm={setShowUpdateForm} onClose={() => setShowUpdateForm(false)}/>} 
            </div>
        </>
    );
}

export default Doctors;
