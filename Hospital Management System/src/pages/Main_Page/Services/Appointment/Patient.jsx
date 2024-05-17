import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Patient({ showCreateForm, setShowCreateForm, showUpdateForm, setShowUpdateForm, setSelectedPatientId }) {
    const [patient, setPatient] = useState([]);
    const [deletePatientId, setDeletePatientId] = useState(null);

    // const handleUpdateButtonClick = (patientId) => {
    //     setSelectedPatientId(patientId);
    //     setShowUpdateForm(!showUpdateForm);
    // };

    useEffect(() => {
        axios.get('http://localhost:9004/api/patient')
            .then(res => setPatient(res.data))
            .catch(err => console.log(err));
    }, []);

    function formatDate(dateString) {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    }

    // const handleDelete = async (id) => {
    //     setDeletePatientId(id);
    // }

    // const handleDeleteConfirm = async () => {
    //     try {
    //         await axios.delete(`http://localhost:9004/api/patient/delete/${deletePatientId}`);
    //         setPatient(patient.filter(item => item.Patient_ID !== deletePatientId));

    //         if (showUpdateForm) {
    //             setShowUpdateForm(false);
    //         }
            
    //         if (showCreateForm) {
    //             setShowCreateForm(false);
    //         }
    //     } catch (err) {
    //         console.log(err);
    //     }
    //     setDeletePatientId(null);
    // }

    return (
        <div className='container-fluid mt-4'>
            {deletePatientId && (
                <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
                    <div className="bg-white p-8 mx-auto rounded-lg">
                        <h1 className="text-lg font-bold mb-4">Confirm Deletion</h1>
                        <p className="mb-4">Are you sure you want to delete this patient record?</p>
                        <div className="flex justify-end">
                            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mr-2 rounded" onClick={handleDeleteConfirm}>Delete</button>
                            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded" onClick={() => setDeletePatientId(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* <button
                className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                style={{ borderRadius: '0.5rem' }}
                onClick={() => setShowCreateForm(!showCreateForm)}>
                {showCreateForm ? 'Close Add Form' : 'Add Patient'}
            </button> */}
            <div className="table-responsive">
                <div>
                    <div className="py-8">
                        <div>
                            <h2 className="text-2xl font-semibold leading-tight">Patients</h2>
                        </div>
                        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                            <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                                <table className="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Firstname</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Lastname</th>
                                            {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Blood type</th> */}
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Gender</th>
                                            {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Conditionn</th> */}
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Admission_Date</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Discharge_Date</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Phone</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {patient.map((data, i) => (
                                            <tr key={i}>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{data.Patient_Fname}</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{data.Patient_Lname}</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{data.Blood_type}</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{data.Email}</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{data.Gender}</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{data.Conditionn}</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{formatDate(data.Admission_Date)}</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{formatDate(data.Discharge_Date)}</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{data.Phone}</p>
                                                </td>
                                                {/* <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                                                <button
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                    onClick={() => handleUpdateButtonClick(data.Patient_ID )}>
                                                    {showUpdateForm ? 'Close Update Form' : 'Update'}
                                                </button>
                                                </td>
                                                <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                                                    <button className='bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => handleDelete(data.Patient_ID)} style={{ borderRadius: '0.5rem', padding: '5px 10px' }}>Delete</button>
                                                </td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Patient;
