import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MedicalHistory({ showCreateForm, setShowCreateForm, showUpdateForm, setShowUpdateForm, setSelectedMedicalHistoryId }) {
    const [medicalHistory, setMedicalHistory] = useState([]);
    const [deleteMedicalHistoryId, setDeleteMedicalHistoryId] = useState(null);

    const handleUpdateButtonClick = (medicalHistoryId) => {
        setSelectedMedicalHistoryId(medicalHistoryId);
        setShowUpdateForm(!showUpdateForm);
    };

    useEffect(() => {
        axios.get('http://localhost:9004/api/medicalhistory')
            .then(res => setMedicalHistory(res.data))
            .catch(err => console.log(err));
    }, []);

    function formatDate(dateString) {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    }

    const handleDelete = async (id) => {
        setDeleteMedicalHistoryId(id);
    }

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9004/api/medicalhistory/delete/${deleteMedicalHistoryId}`);
            setMedicalHistory(medicalHistory.filter(item => item.Record_ID !== deleteMedicalHistoryId));

            if (showUpdateForm) {
                setShowUpdateForm(false);
            }
            
            if (showCreateForm) {
                setShowCreateForm(false);
            }
        } catch (err) {
            console.log(err);
        }
        setDeleteMedicalHistoryId(null);
    }

    return (
        <div className='container-fluid mt-4'>
            {deleteMedicalHistoryId && (
                <div className="fixed inset-0 flex items-center justify-center z-10 overflow-auto bg-black bg-opacity-50">
                    <div className="bg-white p-8 mx-auto rounded-lg">
                        <h1 className="text-lg font-bold mb-4">Confirm Deletion</h1>
                        <p className="mb-4">Are you sure you want to delete this medical history record?</p>
                        <div className="flex justify-end">
                            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mr-2 rounded" onClick={handleDeleteConfirm}>Delete</button>
                            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded" onClick={() => setDeleteMedicalHistoryId(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <button
                className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                style={{ borderRadius: '0.5rem' }}
                onClick={() => setShowCreateForm(!showCreateForm)}>
                {showCreateForm ? 'Close Add Form' : 'Add Medical History'}
            </button>
            <div className="table-responsive">
                <div>
                    <div className="py-8">
                        <div>
                            <h2 className="text-2xl font-semibold leading-tight">Medical History</h2>
                        </div>
                        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                            <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                                <table className="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Patient_ID</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Allergies</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Pre Conditions</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Update</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {medicalHistory.map((data, i) => (
                                            <tr key={i}>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{data.Record_ID}</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{data.Allergies}</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{data.Pre_Conditions}</p>
                                                </td>
                                                <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                                                    <button
                                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                        onClick={() => handleUpdateButtonClick(data.Record_ID)}>
                                                        {showUpdateForm ? 'Close Update Form' : 'Update'}
                                                    </button>
                                                </td>
                                                <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                                                    <button className='bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => handleDelete(data.Record_ID)} style={{ borderRadius: '0.5rem', padding: '5px 10px' }}>Delete</button>
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
        </div>
    );
}

export default MedicalHistory;
