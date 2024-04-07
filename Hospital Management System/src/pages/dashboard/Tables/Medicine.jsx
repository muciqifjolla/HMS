import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Medicine({ showCreateForm, setShowCreateForm,showUpdateForm, setShowUpdateForm, setSelectedMedicineId}) {
    
    const [medicine, setMedicine] = useState([]);


    const handleUpdateButtonClick = (medicineId) => {
        setSelectedMedicineId(medicineId);
        setShowUpdateForm(!showUpdateForm);
        console.log(medicineId)
    };
    

    useEffect(() => {
        axios.get('http://localhost:9004/medicine')
            .then(res => setMedicine(res.data))
            .catch(err => console.log(err));
    }, []);



    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:9004/medicine/${id}`);
            setMedicine(medicine.filter(item => item.Medicine_ID !== id));
        } catch (err) {
            console.log(err);
        }
    }



    return (
        <div className='container-fluid mt-4'>
            <h2 className="my-3">TEST</h2>

            
            <button className='btn btn-success mb-3' style={{ borderRadius: '0.5rem' }} onClick={() => setShowCreateForm(!showCreateForm)}>
                {showCreateForm ? 'Close Add Form' : 'Add +'}
            </button>


            <div className="table-responsive">
                <table className='table table-bordered shadow-sm' style={{ borderRadius: '0.5rem', overflow: 'hidden', maxWidth: '700px' }}>
                    <thead className="thead-dark">
                        <tr>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Cost</th>
                            <th>Update</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicine.map((data, i) => (
                            <tr key={i}>
                                <td style={{ padding: '5px' }}>{data.M_name}</td>
                                <td>{data.M_Quantity}</td>
                                {/* <td>{data.Medicine_ID}</td> */}
                                <td>{data.M_Cost}</td>  
                                
                                
                                <button className='btn btn-success mb-3' style={{ borderRadius: '0.5rem' }} onClick={() => handleUpdateButtonClick(data.Medicine_ID)}>
                                {showUpdateForm ? 'Close Update Form' : 'Update'}
                                </button>
                                

                                    {/* <Link to={`update/${data.Medicine_ID}`} className='btn btn-primary' style={{ borderRadius: '0.5rem', padding: '5px 10px' }}>Update</Link> */}
                                
                                <td>
                                    <button className='btn btn-danger' onClick={() => handleDelete(data.Medicine_ID)} style={{ borderRadius: '0.5rem', padding: '5px 10px' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Medicine;
