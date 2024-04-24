import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UpdateInsurance({id}) {


    const [patient_ID, setPatient_ID] = useState('');
    const [ins_Code, setIns_Code] = useState('');
    const [end_Date, setEnd_Date] = useState('');
    const [provider, setProvider] = useState('');
    const [plan, setPlan] = useState('');
    const [co_Pay, setCo_Pay] = useState('');
    const [coverage, setCoverage] = useState('');
    const [maternity, setMaternity] = useState('');
    const [dental, setDental] = useState('');
    const [optical, setOptical] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [originalData, setOriginalData] = useState({});
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
               
                const response = await axios.get(`http://localhost:9004/api/insurance/${id}`);
                const data = response.data;
                setOriginalData(data);
                setPatient_ID(response.data.Patient_ID);
                setIns_Code(response.data.Ins_Code);
                setEnd_Date(response.data.End_Date);
                setProvider(response.data.Provider);
                setPlan(response.data.Plan);
                setCo_Pay(response.data.Co_Pay);
                setCoverage(response.data.Coverage);
                setMaternity(response.data.Maternity);
                setDental(response.data.Dental);
                setOptical(response.data.Optical);
            } catch (error) {
                console.error('Error fetching insurance:', error);
            }
        };

        fetchData();
    }, []);


    const handleUpdateInsurance = async () => {
        
        try {

            if (patient_ID<1) {
                setAlertMessage("patient_ID name cannot be less than 1.");
                return;
            }
            if (
                patient_ID === originalData.Patient_ID &&
                ins_Code === originalData.Ins_Code &&
                end_Date === originalData.End_Date &&
                provider === originalData.Provider &&
                plan === originalData.Plan &&
                co_Pay === originalData.Co_Pay &&
                coverage === originalData.Coverage &&
                maternity === originalData.Maternity &&
                dental === originalData.Dental &&
                optical ===originalData.Optical
            ) {
                setAlertMessage("Data must be changed before updating.");
                return;
            }
            if (ins_Code<1) {
                setAlertMessage("Insurance Code name cannot be less than 1.");
                return;
            }
            if (!end_Date) {
                setAlertMessage("End Date is required.");
                return;
            }

            if (!provider) {
                setAlertMessage("Provider is required.");
                return;
            }
            if (!plan) {
                setAlertMessage("Plan is required.");
                return;
            }
            if (!co_Pay) {
                setAlertMessage("Co-Pay is required.");
                return;
            }

            if (!coverage) {
                setAlertMessage("Coverage is required.");
                return;
            }


            if (!maternity) {
                setAlertMessage("Maternity is required.");
                return;
            }

            if (!dental) {
                setAlertMessage("Dental is required.");
                return;
            }

            if (!optical) {
                setAlertMessage("Optical is required.");
                return;
            }

            setAlertMessage(''); 

            await axios.put(`http://localhost:9004/api/insurance/update/${id}`, { 
                
                Patient_ID: patient_ID,
                Ins_Code: ins_Code,
                End_Date: end_Date,
                Provider: provider,
                Plan: plan,
                Co_Pay: co_Pay,
                Coverage: coverage,
                Maternity: maternity,
                Dental: dental,
                Optical: optical,
            
            });
            setPatient_ID(patient_ID);
            setIns_Code(ins_Code);
            setEnd_Date(end_Date);
            setProvider(provider);
            setPlan(plan);
            setCo_Pay(co_Pay);
            setCoverage(coverage);
            setMaternity(maternity);
            setDental(dental);
            setOptical(optical);
            navigate('/dashboard/insurance', { replace: true });
            window.location.reload();
        } catch (error) {
            console.error('Error updating insurance:', error);
        }
    };

    
    return (
        <div className='container mt-4'>
            {alertMessage && (
                <div className='alert alert-warning'>
                    {alertMessage}
                </div>
            )}
            <div className='bg-white rounded p-3'>
                <div className='mb-2'>
                    <label htmlFor="dept_head">Patient_ID:  </label>
                    <input type='number' id="dept_head" placeholder='Enter Patient ID' className='form-control'
                        value={patient_ID} onChange={e => setPatient_ID(e.target.value)} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="dept_name">Insurance Code:  </label>
                    <input type='number' id="dept_name" placeholder='Enter Insurance Code' className='form-control'
                        value={ins_Code} onChange={e => setIns_Code(e.target.value)} />
                </div>
                <div className='mb-2'>
                    <label htmlFor="emp_Count">End Date: </label>
                    <input type='date' id="emp_Count" placeholder='Enter End Date' className='form-control'
                        value={end_Date} onChange={e => setEnd_Date(e.target.value)} />
                </div>

                <div className='mb-2'>
                    <label htmlFor="emp_Count">Provider: </label>
                    <input type='text' id="emp_Count" placeholder='Enter Provider' className='form-control'
                        value={provider} onChange={e => setProvider(e.target.value)} />
                </div>

{/* 
                <div className='mb-2'>
                    <label htmlFor="emp_Count">End Date: </label>
                    <input type='date' id="emp_Count" placeholder='Enter End Date' className='form-control'
                        value={end_Date} onChange={e => setEnd_Date(e.target.value)} />
                </div> */}


                <div className='mb-2'>
                    <label htmlFor="emp_Count">Plan: </label>
                    <input type='text' id="emp_Count" placeholder='Enter Plan' className='form-control'
                        value={plan} onChange={e => setPlan(e.target.value)} />
                </div>

                <div className='mb-2'>
                    <label htmlFor="emp_Count">Co-Pay: </label>
                    <input type='text' id="emp_Count" placeholder='Enter Co Pay' className='form-control'
                        value={co_Pay} onChange={e => setCo_Pay(e.target.value)} />
                </div>

                            <div className='mb-2'>
                    <label htmlFor="coverage">Coverage: </label>
                    <input 
                        type='text' 
                        id="coverage" 
                        placeholder='Enter Coverage' 
                        className='form-control'
                        value={coverage} 
                        onChange={e => setCoverage(e.target.value)} 
                    />
                </div>

            <div className='mb-2'>
                <label htmlFor="maternity">Maternity: </label>
                <input 
                    type='number' 
                    id="maternity" 
                    placeholder='Enter Maternity' 
                    className='form-control'
                    value={maternity} 
                    onChange={e => setMaternity(e.target.value)} 
                />
            </div>

            <div className='mb-2'>
                <label htmlFor="dental">Dental: </label>
                <input 
                    type='number' 
                    id="dental" 
                    placeholder='Enter Dental' 
                    className='form-control'
                    value={dental} 
                    onChange={e => setDental(e.target.value)} 
                />
            </div>

            <div className='mb-2'>
                <label htmlFor="optical">Optical: </label>
                <input 
                    type='number' 
                    id="optical" 
                    placeholder='Enter Optical' 
                    className='form-control'
                    value={optical} 
                    onChange={e => setOptical(e.target.value)} 
                />
            </div>


                
                <button type="button" className='btn btn-success' onClick={handleUpdateInsurance}>Submit</button>
            </div>
        </div>
    );

}

export default UpdateInsurance;
