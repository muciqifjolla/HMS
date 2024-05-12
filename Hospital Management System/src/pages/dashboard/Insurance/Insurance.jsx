import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Insurance({
    showCreateForm,
    setShowCreateForm,
    showUpdateForm,
    setShowUpdateForm,
    setSelectedInsuranceId,
}) {
    const [insurance, setInsurance] = useState([]);
    const [deleteInsuranceId, setDeleteInsuranceId] = useState(null);
    const [patients, setPatients] = useState([]);


    const handleUpdateButtonClick = (insuranceId) => {
        setSelectedInsuranceId(insuranceId);
        setShowUpdateForm((prevState) => prevState === insuranceId ? null : insuranceId);
        if (showCreateForm) {
            setShowCreateForm(false); // Close create form if open
        }
    };

    useEffect(() => {
        axios
            .get('http://localhost:9004/api/insurance')
            .then((res) => setInsurance(res.data))
            .catch((err) => console.error('Error fetching insurance:', err));


            axios
            .get('http://localhost:9004/api/patient')
            .then((res) => setPatients(res.data))
            .catch((err) => console.log(err));


    }, []);

    const handleDelete = (id) => {
        setDeleteInsuranceId(id);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/insurance/delete/${deleteInsuranceId}`);
            setInsurance(insurance.filter((data) => data.Policy_Number !== deleteInsuranceId));
            
            if (showUpdateForm) {
                setShowUpdateForm(false);
            }
            
            if (showCreateForm) {
                setShowCreateForm(false);
            }
        } catch (err) {
            console.error('Error deleting insurance:', err);
        }
        setDeleteInsuranceId(null);
    };

    const handleCreateFormToggle = () => {
        setShowCreateForm(!showCreateForm);
        setShowUpdateForm(false); // Ensure update form is closed
    };


    const getPatientName = (patientId) => { 
        console.log("Patient ID:", patientId);
        console.log("Patients:", patients);
    
        const patient = patients.find(pat => pat.id === patientId);
        console.log("Found Patient:", patient);
    
        if (patient) {
            return `${patient.Patient_Fname} ${patient.Patient_Lname}`;
        } else {
            return 'Unknown';
        }
    };



    return (
        <div className='container-fluid mt-4'>
            {deleteInsuranceId && (
                <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
                    <div className="bg-white p-8 mx-auto rounded-lg">
                        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
                        <p>Are you sure you want to delete this insurance?</p>
                        <div className="flex justify-end">
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mr-2 rounded"
                                onClick={handleDeleteConfirm}
                            >
                                Delete
                            </button>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                onClick={() => setDeleteInsuranceId(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

                <button
                    className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    style={{ borderRadius: '0.5rem' }}
                    onClick={handleCreateFormToggle}
                >
                    {showCreateForm ? 'Close' : 'Add Insurance'}
                </button>



            <div className="table-responsive">
                <div className="py-8">
                    <div>
                        <h2 className="text-2xl font-semibold leading-tight">Insurance</h2>
                    </div>
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Patient</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ins. Code</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">End Date</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Provider</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Plan</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Co-Pay</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Coverage</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Maternity</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Dental</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Optical</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">(ID)</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Update</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {insurance.map((data, i) => (
                                        <tr key={i}>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm" >{getPatientName(data.Patient_Fname)}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Ins_Code}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.End_Date}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Provider}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Plan}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Co_Pay}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Coverage}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Maternity}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Dental}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Optical}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Policy_Number}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <button
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                    onClick={() => handleUpdateButtonClick(data.Policy_Number)}
                                                >
                                                    {showUpdateForm ===data.Policy_Number? 'Close' : 'Update'}
                                                </button>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <button
                                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                                                    onClick={() => handleDelete(data.Policy_Number)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Insurance;
