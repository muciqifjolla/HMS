import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MedicalHistory({ showCreateForm, setShowCreateForm, showUpdateForm, setShowUpdateForm, setSelectedMedicalHistoryId }) {

    const [medicalHistories, setMedicalHistories] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:9004/api/medicalhistory')
            .then(res => setMedicalHistories(res.data))
            .catch(err => console.log(err));
    }, []);

    const handleUpdateButtonClick = (medicalHistoryId) => {
        setSelectedMedicalHistoryId(medicalHistoryId);
        setShowUpdateForm(!showUpdateForm);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:9004/api/medicalhistory/delete/${id}`);
            setMedicalHistories(medicalHistories.filter(item => item.Record_ID !== id));
        } catch (err) {
            console.log(err);
        }
    };

    function formatDate(dateString) {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    }

    return (
        <div className='container-fluid mt-4'>
            <button className='bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' style={{ borderRadius: '0.5rem' }} onClick={() => setShowCreateForm(!showCreateForm)}>
                {showCreateForm ? 'Close Add Form' : 'Add Medical History'}
            </button>
            <div className="table-responsive">
                <div>
                    <div className="py-8">
                        <div>
                            <h2 className="text-2xl font-semibold leading-tight">Medical Histories</h2>
                        </div>
                        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                            <div
                                className="inline-block min-w-full shadow-md rounded-lg overflow-hidden"
                            >
                                <table className="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Record ID
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Patient ID
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Allergies
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Pre-Conditions
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {medicalHistories.map((data, i) => (
                                            <tr key={i}>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{data.Record_ID}</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{data.Patient_ID}</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{data.Allergies}</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{data.Pre_Conditions}</p>
                                                </td>
                                                <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
                                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleUpdateButtonClick(data.Record_ID)}>
                                                        {showUpdateForm ? 'Close Update Form' : 'Update'}
                                                    </button>
                                                    <button className='bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2' onClick={() => handleDelete(data.Record_ID)}>Delete</button>
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
