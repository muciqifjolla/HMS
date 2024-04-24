import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


function Insurance({ showCreateForm, setShowCreateForm,showUpdateForm, setShowUpdateForm, setSelectedInsuranceId}) {
    
    const [insurance, setInsurance] = useState([]);


    const handleUpdateButtonClick = (insuranceId) => {
        setSelectedInsuranceId(insuranceId);
        setShowUpdateForm(!showUpdateForm);
    };
    

    useEffect(() => {
        axios.get('http://localhost:9004/api/insurance')
            .then(res => setInsurance(res.data))
            .catch(err => console.log(err));
    }, []);



    const handleDelete = async (id) => {
        // Display a confirmation dialog
        const confirmDelete = window.confirm('Are you sure you want to delete this item?');
        if (confirmDelete) {
          try {
            await axios.delete(`http://localhost:9004/api/insurance/delete/${id}`);
            setInsurance(insurance.filter((item) => item.Policy_Number !== id));
          } catch (err) {
            console.log(err);
          }
        }
      };


    return (
        <div className='container-fluid mt-4'>

    <button className='bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' style={{ borderRadius: '0.5rem' }} onClick={() => setShowCreateForm(!showCreateForm)}>
        {showCreateForm ? 'Close Add Form' : 'Add Insurance'}
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
                                {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">(Policy_Number ID)</th> */}
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">(Patient ID)</th>                    
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ins_Code</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">End Date</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Provider</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Plan</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Co_Pay</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Coverage</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Maternity</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Dental</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Optical</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Update</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {insurance.map((data, i) => (
                                <tr key={i}>
                                    {/* <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm" >{data.Policy_Number}</td> */}
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm" >{data.Patient_ID}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Ins_Code}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.End_Date}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Provider}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Plan}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Co_Pay}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Coverage}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Maternity}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Dental}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{data.Optical}</td>

                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleUpdateButtonClick(data.Policy_Number)}>
                                            {showUpdateForm ? 'Close Update Form' : 'Update'}
                                        </button>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <button className='bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => handleDelete(data.Policy_Number)} style={{ borderRadius: '0.5rem', padding: '5px 10px' }}>Delete</button>
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
