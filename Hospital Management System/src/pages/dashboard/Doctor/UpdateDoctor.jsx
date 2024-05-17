import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ErrorModal from '../../../components/ErrorModal'; // Assuming this component exists for handling error messages

function UpdateDoctor({ id, onClose }) {
    const [qualifications, setQualifications] = useState('');
    const [empID, setEmpID] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [originalData, setOriginalData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9004/api/doctor/${id}`);
                const data = response.data;
                setOriginalData(data);
                setQualifications(data.Qualifications);
                setEmpID(data.Emp_ID);
                setSpecialization(data.Specialization);
            } catch (error) {
                console.error('Error fetching doctor:', error);
                showAlert('Error fetching doctor details.');
            }
        };

        fetchData();
    }, [id]);

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowErrorModal(true);
        setTimeout(() => {
            setAlertMessage('');
            setShowErrorModal(false);
        }, 3000);
    };

    const handleUpdateDoctor = async () => {
        if (!qualifications.trim() || !empID.trim() || !specialization.trim()) {
            showAlert("All fields are required.");
            return;
        }

        if (
            qualifications === originalData.Qualifications &&
            empID === originalData.Emp_ID &&
            specialization === originalData.Specialization
        ) {
            showAlert("Data must be changed before updating.");
            return;
        }

        try {
            await axios.put(`http://localhost:9004/api/doctor/update/${id}`, {
                Qualifications: qualifications,
                Emp_ID: empID,
                Specialization: specialization,
            });

            // Close the modal after updating
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error updating doctor:', error);
            showAlert('Error updating doctor.');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
            <div className="bg-white p-8 mx-auto rounded-lg w-96">
                {showErrorModal && (
                    <ErrorModal message={alertMessage} onClose={() => setShowErrorModal(false)} />
                )}
                <h1 className="text-lg font-bold mb-4">Update Doctor</h1>
                <div className="mb-4">
                    <label htmlFor="qualifications">Qualifications:</label>
                    <input
                        type="text"
                        id="qualifications"
                        placeholder="Enter Qualifications"
                        className="form-control"
                        value={qualifications}
                        onChange={(e) => setQualifications(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="empID">Employee ID:</label>
                    <input
                        type="text"
                        id="empID"
                        placeholder="Enter Employee ID"
                        className="form-control"
                        value={empID}
                        onChange={(e) => setEmpID(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="specialization">Specialization:</label>
                    <input
                        type="text"
                        id="specialization"
                        placeholder="Enter Specialization"
                        className="form-control"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                    />
                </div>
                <div className="flex justify-end">
                    <button type="button" className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleUpdateDoctor}>
                        Submit
                    </button>
                    <button
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 ml-2 rounded"
                        onClick={onClose} // Call the onClose function passed from props
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UpdateDoctor;
