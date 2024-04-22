import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Emergency_Contact({ showCreateForm, setShowCreateForm,showUpdateForm, setShowUpdateForm, setSelectedEmergency_ContactId}) {
    
    const [emergency_contact, setEmergency_Contact] = useState([]);


    const handleUpdateButtonClick = (smergency_contactId) => {
        setSelectedEmergency_ContactId(smergency_contactId);
        setShowUpdateForm(!showUpdateForm);
    };
    

    useEffect(() => {
        axios.get('http://localhost:9004/api/emergency_contact')
            .then(res => setEmergency_Contact(res.data))
            .catch(err => console.log(err));
    }, []);



    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:9004/api/emergency_contact/delete/${id}`);
            setEmergency_Contact(emergency_contact.filter(item => item.Contact_ID !== id));
        } catch (err) {
            console.log(err);
        }
    }



    return (
        <div className='container-fluid mt-4'>

    <button className='bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' style={{ borderRadius: '0.5rem' }} onClick={() => setShowCreateForm(!showCreateForm)}>
        {showCreateForm ? 'Close Add Form' : 'Add Emergency Contact'}
    </button>

    <div className="table-responsive">
        <div className="py-8">
            <div>
                <h2 className="text-2xl font-semibold leading-tight">Emergency Contact</h2>
            </div>
            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">(ID)</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Phone</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Relation</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Patient</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Update</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {emergency_contact.map((data, i) => (
                                <tr key={i}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm" >{data.Contact_Name}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm" >{data.Contact_ID}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Phone}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Relation}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Patient_ID}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleUpdateButtonClick(data.Contact_ID)}>
                                            {showUpdateForm ? 'Close Update Form' : 'Update'}
                                        </button>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <button className='bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => handleDelete(data.Contact_ID)} style={{ borderRadius: '0.5rem', padding: '5px 10px' }}>Delete</button>
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

export default Emergency_Contact;
